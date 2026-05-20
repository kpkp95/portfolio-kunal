/**
 * lib/rag/embeddings.ts
 *
 * Auto-detecting embedding generator with fallback support:
 * 1. Vertex AI text-embedding-004 (768-dim) if GOOGLE_SERVICE_ACCOUNT_JSON + GOOGLE_CLOUD_PROJECT are present.
 * 2. Hugging Face sentence-transformers/all-MiniLM-L6-v2 (384-dim) if HUGGING_FACE_API_KEY is present (and not placeholder).
 * 3. Gemini API gemini-embedding-001 (768-dim) if GEMINI_API_KEY is present.
 */

// Determine the active backend
function getBackend(): "vertex" | "huggingface" | "gemini" {
  const hasVertex = !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON &&
    process.env.GOOGLE_CLOUD_PROJECT
  );
  if (hasVertex) return "vertex";

  const hfKey = process.env.HUGGING_FACE_API_KEY;
  const hasHF = !!(hfKey && hfKey !== "your_hf_token_here" && hfKey.trim() !== "");
  if (hasHF) return "huggingface";

  const hasGemini = !!process.env.GEMINI_API_KEY;
  if (hasGemini) return "gemini";

  throw new Error(
    "No valid embedding backend credentials found in environment. " +
    "Please configure GOOGLE_SERVICE_ACCOUNT_JSON, HUGGING_FACE_API_KEY, or GEMINI_API_KEY in .env.local"
  );
}

/**
 * Generate a single embedding using the active backend.
 */
async function fetchEmbedding(
  text: string,
  taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY",
  retries = 2
): Promise<number[]> {
  const backend = getBackend();
  const cleanedText = text.replace(/\n/g, " ");

  if (backend === "vertex") {
    const { getGCPToken } = await import("@/lib/google/auth");
    const token = await getGCPToken();
    const project = process.env.GOOGLE_CLOUD_PROJECT!;
    const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/text-embedding-004:predict`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instances: [{ content: cleanedText, task_type: taskType }],
        parameters: { outputDimensionality: 768 },
      }),
    });

    if (!res.ok) {
      throw new Error(`Vertex AI embedding failed [${res.status}]: ${await res.text()}`);
    }

    const data = (await res.json()) as {
      predictions: Array<{ embeddings: { values: number[] } }>;
    };
    return data.predictions[0].embeddings.values;
  }

  if (backend === "huggingface") {
    const apiKey = process.env.HUGGING_FACE_API_KEY!;
    const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
    const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: cleanedText.slice(0, 512) }),
    });

    if (res.status === 503 && retries > 0) {
      const body = (await res.json().catch(() => ({ estimated_time: 10 }))) as {
        estimated_time?: number;
      };
      const wait = Math.min((body.estimated_time ?? 10) * 1000, 20_000);
      console.log(`  HF model loading, waiting ${Math.round(wait / 1000)}s...`);
      await new Promise((r) => setTimeout(r, wait));
      return fetchEmbedding(text, taskType, retries - 1);
    }

    if (!res.ok) {
      throw new Error(`HF embedding failed [${res.status}]: ${await res.text()}`);
    }

    const data = (await res.json()) as number[][] | number[];
    const embedding = Array.isArray(data[0]) ? (data as number[][])[0] : (data as number[]);
    return embedding;
  }

  // Fallback to Gemini API
  const apiKey = process.env.GEMINI_API_KEY!;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "models/gemini-embedding-001",
      content: { parts: [{ text: cleanedText }] },
      taskType: taskType,
      outputDimensionality: 768,
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API embedding failed [${res.status}]: ${await res.text()}`);
  }

  const data = (await res.json()) as { embedding: { values: number[] } };
  return data.embedding.values;
}

/** Generate embedding for a user query (retrieval time). */
export async function generateEmbedding(text: string): Promise<number[]> {
  return fetchEmbedding(text, "RETRIEVAL_QUERY");
}

/** Batch-generate embeddings for ingestion (with rate-limit compliance). */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  for (const text of texts) {
    results.push(await fetchEmbedding(text, "RETRIEVAL_DOCUMENT"));
    await new Promise((r) => setTimeout(r, backendWaitTime()));
  }
  return results;
}

function backendWaitTime(): number {
  const backend = getBackend();
  if (backend === "vertex") return 50; // GCP is fast and has high rate limits
  if (backend === "huggingface") return 150; // Hugging Face is free, rate-limit politely
  return 100; // Gemini API
}
