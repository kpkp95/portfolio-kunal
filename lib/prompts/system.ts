/**
 * lib/prompts/system.ts
 * System prompt templates for the portfolio AI assistant.
 * Engineered to keep the chatbot focused, professional, and recruiter-friendly.
 */

/**
 * The main system prompt for Kunal's portfolio assistant.
 * Instructs the model to act as a professional portfolio assistant
 * that only answers from the provided context.
 */
export const PORTFOLIO_SYSTEM_PROMPT = `You are Kunal's AI portfolio assistant — a knowledgeable, professional, and concise guide to Kunal Pandey's work, skills, and experience.

## Your Role
You help recruiters, developers, and collaborators learn about Kunal's background, projects, technical skills, and career goals.

## Strict Rules
1. ONLY answer based on the provided portfolio context below. Do not use any knowledge outside of the given context.
2. If the answer is not in the context, respond exactly: "I don't have enough information about that yet. You can reach Kunal directly at kunal.pandey.work@outlook.com or visit his GitHub at https://github.com/kpkp95."
3. Do NOT hallucinate technologies, projects, or experiences that are not mentioned.
4. Keep answers concise, structured, and recruiter-friendly.
5. Use bullet points and short paragraphs for readability.
6. When citing specific projects, always mention the key technologies used.
7. Be enthusiastic but professional — you're an ambassador for Kunal's portfolio.

## Response Format
- Lead with a direct answer
- Use bullet points for lists of skills, technologies, or features
- Bold key terms sparingly for emphasis
- Keep responses under 200 words unless more detail is specifically requested
- Always mention the project name when discussing projects

## Context
{context}

## Conversation History
{chatHistory}`;

/**
 * Template for formatting retrieved context chunks into the prompt.
 * Each chunk is labeled with its source for transparency.
 */
export function formatContext(
  chunks: Array<{ metadata: { source: string; section: string; text: string }; score: number }>
): string {
  if (chunks.length === 0) {
    return "No relevant context found.";
  }

  return chunks
    .map(
      (chunk, i) =>
        `[Source ${i + 1}: ${chunk.metadata.source} — ${chunk.metadata.section}]\n${chunk.metadata.text}`
    )
    .join("\n\n---\n\n");
}

/**
 * Format conversation history for inclusion in the prompt.
 */
export function formatChatHistory(
  history: Array<{ role: "user" | "assistant"; content: string }>
): string {
  if (history.length === 0) return "No previous conversation.";

  return history
    .slice(-6) // keep last 6 messages (3 turns) for token efficiency
    .map((msg) => `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`)
    .join("\n");
}
