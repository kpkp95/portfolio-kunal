/**
 * app/api/chat/route.ts
 * Unified RAG chat endpoint — powered by Google Cloud Vertex AI or Google AI Studio.
 *
 * Flow:
 * 1. Auto-detects credentials:
 *    - If GOOGLE_SERVICE_ACCOUNT_JSON + GOOGLE_CLOUD_PROJECT are present -> Vertex AI (gemini-2.0-flash)
 *    - Else -> Gemini API key (gemini-2.0-flash-lite)
 * 2. Generate embedding for query via auto-detecting embeddings helper.
 * 3. Query Pinecone for top-5 relevant knowledge base chunks.
 * 4. stream responses back to client with source citations.
 */

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateEmbedding } from "@/lib/rag/embeddings";
import { queryPinecone } from "@/lib/pinecone/client";
import {
  PORTFOLIO_SYSTEM_PROMPT,
  formatContext,
  formatChatHistory,
} from "@/lib/prompts/system";

export const runtime = "nodejs";
export const maxDuration = 30;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

/**
 * Auto-detects if Vertex AI credentials are present.
 */
function isVertexAIConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON &&
    process.env.GOOGLE_CLOUD_PROJECT
  );
}

// In-memory cache for IP-based rate limiting
const ipCache = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string, limit = 10, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const record = ipCache.get(ip);

  if (!record || now > record.resetTime) {
    // New window or expired window -> reset
    ipCache.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= limit) {
    return true;
  }

  record.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || (req as any).ip || "127.0.0.1";

    if (isRateLimited(ip)) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before sending another message." },
        { status: 429 }
      );
    }

    const { message, history = [] }: ChatRequest = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Log the user's question, IP, and history count (ideal for Vercel/Axiom tracking)
    console.log(
      `[Chat Bot Query] IP: ${ip} | History: ${history.length} msgs | Asked: "${message.replace(/\n/g, " ")}"`
    );

    // ── Step 1: Embed the query (automatically uses Vertex/HF/Gemini depending on env) ──
    let queryEmbedding: number[];
    try {
      queryEmbedding = await generateEmbedding(message);
    } catch (err: any) {
      console.error("Embedding generation failed:", err);
      return NextResponse.json(
        { error: `Embedding failed: ${err.message || err}` },
        { status: 500 }
      );
    }

    // ── Step 2: Retrieve context from Pinecone ──
    let retrievedChunks: Array<{
      metadata: { source: string; section: string; text: string };
      score: number;
    }> = [];

    try {
      retrievedChunks = await queryPinecone(queryEmbedding, 5);
    } catch (err) {
      console.error("Pinecone query failed, continuing without context:", err);
    }

    // ── Step 3: Build system prompt ──
    const systemPrompt = PORTFOLIO_SYSTEM_PROMPT
      .replace("{context}", formatContext(retrievedChunks))
      .replace("{chatHistory}", formatChatHistory(history));

    const sources = [
      ...new Set(
        retrievedChunks
          .filter((c) => c.score > 0.3)
          .map((c) => c.metadata.source)
      ),
    ];

    const encoder = new TextEncoder();

    // ── Step 4: Stream response ──
    if (isVertexAIConfigured()) {
      console.log("Routing chat request to Vertex AI (gemini-2.5-flash)...");
      const { getGCPToken } = await import("@/lib/google/auth");
      const token = await getGCPToken();
      const project = process.env.GOOGLE_CLOUD_PROJECT!;
      const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
      const model = "gemini-2.5-flash";
      const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/${model}:streamGenerateContent`;

      // Transform history to Vertex / Gemini REST API format
      const contents = history.slice(-4).map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      // Append current user message
      contents.push({ role: "user", parts: [{ text: message }] });

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 400,
          },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Vertex AI chat failed [${res.status}]: ${errorText}`);
      }

      const readable = new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            // Send source citations first
            if (sources.length > 0) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "sources", sources })}\n\n`)
              );
            }

            const reader = res.body?.getReader();
            if (!reader) throw new Error("No reader for Vertex AI stream");

            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              
              // Extract and parse complete JSON objects { ... } from the buffer
              while (true) {
                const firstBrace = buffer.indexOf("{");
                if (firstBrace === -1) break;

                let braceCount = 0;
                let inString = false;
                let escaped = false;
                let matchingIndex = -1;

                for (let i = firstBrace; i < buffer.length; i++) {
                  const char = buffer[i];
                  if (escaped) {
                    escaped = false;
                    continue;
                  }
                  if (char === "\\") {
                    escaped = true;
                    continue;
                  }
                  if (char === '"') {
                    inString = !inString;
                    continue;
                  }
                  if (!inString) {
                    if (char === "{") {
                      braceCount++;
                    } else if (char === "}") {
                      braceCount--;
                      if (braceCount === 0) {
                        matchingIndex = i;
                        break;
                      }
                    }
                  }
                }

                if (matchingIndex === -1) {
                  // Wait for the rest of the object to arrive
                  break;
                }

                const objectStr = buffer.slice(firstBrace, matchingIndex + 1);
                buffer = buffer.slice(matchingIndex + 1);

                try {
                  const parsed = JSON.parse(objectStr);
                  const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ type: "token", content: text })}\n\n`)
                    );
                  }
                } catch (e) {
                  console.error("Failed to parse extracted JSON object:", e);
                }
              }
            }

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
            controller.close();
          } catch (err) {
            console.error("Vertex stream parsing error:", err);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "token", content: "\n\n⚠️ Stream interrupted. Please try again." })}\n\n`
              )
            );
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // ── Fallback: Gemini API (Google AI Studio) ──
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("No Gemini API key or GCP credentials configured in .env.local");
    }

    console.log("Routing chat request to Gemini API (gemini-2.0-flash-lite)...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const CHAT_MODEL = "gemini-2.0-flash-lite";

    const modelInstance = genAI.getGenerativeModel({
      model: CHAT_MODEL,
      systemInstruction: systemPrompt,
      generationConfig: { temperature: 0.3, maxOutputTokens: 400 },
    });

    const geminiHistory = history.slice(-4).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = modelInstance.startChat({ history: geminiHistory });
    const streamResult = await chat.sendMessageStream(message);

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          // Send source citations first
          if (sources.length > 0) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "sources", sources })}\n\n`)
            );
          }

          // Stream tokens
          for await (const chunk of streamResult.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "token", content: text })}\n\n`)
              );
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        } catch (err) {
          console.error("Gemini API stream error:", err);
          try {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "token", content: "\n\n⚠️ Something went wrong. Please try again." })}\n\n`
              )
            );
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
            controller.close();
          } catch {
            controller.error(err);
          }
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: `Failed to process your request: ${error.message || error}` },
      { status: 500 }
    );
  }
}
