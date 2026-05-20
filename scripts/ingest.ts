/**
 * scripts/ingest.ts
 *
 * Knowledge base ingestion script with dynamic dimension matching.
 * Uses the unified embedding layer to automatically chunk, embed, and index
 * your portfolio data into Pinecone.
 *
 * Run with:  npm run ingest
 */

import * as fs from "fs";
import * as path from "path";
import { Pinecone } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function collectTextFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...collectTextFiles(full));
    } else if (e.isFile() && e.name.endsWith(".txt")) {
      files.push(full);
    }
  }
  return files;
}

function chunkText(text: string, size: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const chunk = text.slice(start, Math.min(start + size, text.length)).trim();
    if (chunk) chunks.push(chunk);
    start += size - overlap;
  }
  return chunks;
}

function extractSection(chunk: string, filename: string): string {
  const h = chunk.match(/^##?\s+(.+)/m);
  if (h) return h[1].trim();
  const l = chunk.match(/^([A-Z][^.!?\n]{5,50})(?:\n|$)/m);
  if (l) return l[1].trim();
  return filename.replace(".txt", "").replace(/-/g, " ");
}

function extractProject(chunk: string): string | undefined {
  const m = chunk.match(/(?:Project:|##\s+)([^\n]+)/i);
  return m ? m[1].trim() : undefined;
}

function batchArr<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Load .env.local variables
  dotenv.config({ path: ".env.local" });

  const { PINECONE_API_KEY } = process.env;
  const INDEX_NAME = process.env.PINECONE_INDEX_NAME || "portfolio-rag";
  const DATA_DIR = path.join(process.cwd(), "data");

  if (!PINECONE_API_KEY) {
    console.error("ERROR: Missing PINECONE_API_KEY in .env.local");
    process.exit(1);
  }

  // Import the generateEmbedding function dynamically so env vars are populated first
  const { generateEmbedding } = await import("../lib/rag/embeddings");

  console.log("Starting ingestion pipeline...");
  
  // ── 1. Collect and chunk files ───────────────────────────────────────────────
  const files = collectTextFiles(DATA_DIR);
  console.log(`Found ${files.length} file(s) in /data:\n  ${files.join("\n  ")}\n`);
  
  if (!files.length) {
    console.error("ERROR: No .txt files found in /data. Please populate text files to ingest.");
    process.exit(1);
  }

  interface Chunk {
    id: string;
    text: string;
    source: string;
    section: string;
    project?: string;
  }
  
  const allChunks: Chunk[] = [];

  for (const fp of files) {
    const filename = path.basename(fp);
    const rel = path.relative(process.cwd(), fp);
    const chunks = chunkText(fs.readFileSync(fp, "utf-8"), CHUNK_SIZE, CHUNK_OVERLAP);
    console.log(`  ${rel} -> ${chunks.length} chunk(s)`);
    
    chunks.forEach((c, i) => {
      allChunks.push({
        id: `${filename.replace(".txt", "")}_chunk_${i}`,
        text: c,
        source: filename,
        section: extractSection(c, filename),
        project: extractProject(c),
      });
    });
  }
  console.log(`\nTotal chunks collected: ${allChunks.length}`);

  if (allChunks.length === 0) {
    console.error("ERROR: No content found in files to ingest.");
    process.exit(1);
  }

  // ── 2. Determine embedding dimension dynamically ───────────────────────────
  console.log("\nTesting embedding API to determine vector dimensions...");
  let testVector: number[];
  try {
    testVector = await generateEmbedding(allChunks[0].text);
  } catch (err: any) {
    console.error("\nERROR: Failed to generate test embedding:", err.message || err);
    console.error("Verify your environment variables in .env.local are correct.");
    process.exit(1);
  }
  
  const EMBED_DIM = testVector.length;
  console.log(`Successfully generated test vector. Dimensions detected: ${EMBED_DIM} ✓`);

  // ── 3. Auto-create or verify Pinecone index ──────────────────────────────────
  const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
  const indexList = await pinecone.listIndexes();
  const existing = indexList.indexes?.find((i) => i.name === INDEX_NAME);

  if (existing) {
    if (existing.dimension !== EMBED_DIM) {
      console.log(`\n[Mismatch] Existing index "${INDEX_NAME}" has ${existing.dimension}-dimensions, but active embedding model requires ${EMBED_DIM}-dimensions.`);
      console.log(`Deleting existing index and recreating it for ${EMBED_DIM}-dim vectors...`);
      await pinecone.deleteIndex(INDEX_NAME);
      await sleep(10000);
    } else {
      console.log(`Index "${INDEX_NAME}" already exists with matching ${EMBED_DIM}-dimensions ✓\n`);
    }
  }

  // Re-check index list and create if missing
  const currentList = await pinecone.listIndexes();
  if (!currentList.indexes?.find((i) => i.name === INDEX_NAME)) {
    console.log(`Creating serverless Pinecone index "${INDEX_NAME}" (${EMBED_DIM}-dim, cosine)...`);
    await pinecone.createIndex({
      name: INDEX_NAME,
      dimension: EMBED_DIM,
      metric: "cosine",
      spec: { serverless: { cloud: "aws", region: "us-east-1" } },
    });
    console.log("Waiting for index to initialize...");
    await sleep(15000);
    console.log("Index is ready ✓\n");
  }

  // ── 4. Generate all embeddings ─────────────────────────────────────────────
  console.log("Generating all embeddings...");
  const vectors: Array<{ id: string; values: number[]; metadata: Record<string, any> }> = [];

  for (let i = 0; i < allChunks.length; i++) {
    const chunk = allChunks[i];
    process.stdout.write(`\r  [${i + 1}/${allChunks.length}] Generating: ${chunk.id.padEnd(50, " ")}`);
    
    try {
      const values = await generateEmbedding(chunk.text);
      vectors.push({
        id: chunk.id,
        values,
        metadata: {
          source: chunk.source,
          section: chunk.section,
          ...(chunk.project && { project: chunk.project }),
          chunk_id: chunk.id,
          text: chunk.text, // raw content
        },
      });
    } catch (err: any) {
      console.error(`\nFailed to embed chunk ${chunk.id}:`, err.message || err);
      process.exit(1);
    }
    
    // Polite wait between items
    await sleep(100);
  }

  console.log(`\n\nGenerated ${vectors.length} vectors successfully!`);

  // ── 5. Upsert to Pinecone ──────────────────────────────────────────────────
  console.log(`\nUpserting to Pinecone index "${INDEX_NAME}"...`);
  const index = pinecone.index(INDEX_NAME);
  
  // Upsert in batches of 100
  const batches = batchArr(vectors, 100);
  for (let j = 0; j < batches.length; j++) {
    process.stdout.write(`\r  Upserting batch ${j + 1}/${batches.length}...`);
    await index.upsert(batches[j]);
  }

  console.log(`\n\nIngestion complete!`);
  console.log(`  -> ${vectors.length} vectors indexed in Pinecone`);
  console.log(`  -> Dimension: ${EMBED_DIM}`);
  console.log(`  -> Portfolio Assistant RAG is ready! 🚀\n`);
}

main().catch((err) => {
  console.error("\nIngestion failed:", err.message || err);
  process.exit(1);
});
