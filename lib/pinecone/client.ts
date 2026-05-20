/**
 * lib/pinecone/client.ts
 * Pinecone vector database client utilities.
 * Handles initializing the client, querying, and upserting vectors.
 */

import { Pinecone } from "@pinecone-database/pinecone";

// Singleton Pinecone client
let pineconeClient: Pinecone | null = null;

/**
 * Returns a singleton Pinecone client instance.
 */
export function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pineconeClient;
}

/**
 * Returns the Pinecone index for the portfolio knowledge base.
 */
export function getPineconeIndex() {
  const client = getPineconeClient();
  return client.index(process.env.PINECONE_INDEX_NAME || "portfolio-rag");
}

/**
 * Chunk metadata stored alongside each vector in Pinecone.
 */
export interface ChunkMetadata {
  source: string;    // filename (e.g. "resume.txt")
  section: string;   // section title (e.g. "Skills", "Projects")
  project?: string;  // project name if applicable
  chunk_id: string;  // unique chunk identifier
  text: string;      // the raw text of this chunk (for display)
  [key: string]: string | undefined; // satisfies Pinecone's RecordMetadata index signature
}

/**
 * Query Pinecone for the top-k most semantically similar chunks.
 *
 * @param queryEmbedding - The embedding vector for the user's query
 * @param topK           - Number of results to retrieve (default: 5)
 * @returns Array of matching chunks with their metadata and scores
 */
export async function queryPinecone(
  queryEmbedding: number[],
  topK: number = 5
): Promise<Array<{ metadata: ChunkMetadata; score: number }>> {
  const index = getPineconeIndex();

  const result = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });

  return (result.matches || []).map((match) => ({
    metadata: match.metadata as unknown as ChunkMetadata,
    score: match.score ?? 0,
  }));
}

/**
 * Upsert a batch of vector records into Pinecone.
 * Used by the ingestion script to populate the knowledge base.
 */
export async function upsertVectors(
  vectors: Array<{
    id: string;
    values: number[];
    metadata: ChunkMetadata;
  }>
) {
  const index = getPineconeIndex();
  await index.upsert(vectors);
}
