/**
 * lib/google/auth.ts
 * GCP service account authentication utility.
 *
 * Returns a short-lived bearer token from the service account JSON.
 *
 * Supports both:
 * 1. Raw JSON string in GOOGLE_SERVICE_ACCOUNT_JSON (e.g. on Vercel)
 * 2. File path in GOOGLE_SERVICE_ACCOUNT_JSON (e.g. "key.json" stored locally)
 *
 * Caches the token until 60s before expiry.
 */

import { GoogleAuth } from "google-auth-library";
import * as fs from "fs";
import * as path from "path";

// Module-level token cache to avoid redundant token fetches
let cachedToken: string | null = null;
let tokenExpiry = 0;

/**
 * Returns a valid GCP bearer token, refreshing if expired or near expiry.
 */
export async function getGCPToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < tokenExpiry - 60_000) {
    return cachedToken;
  }

  const credValue = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credValue) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON environment variable");
  }

  let credentials: any;

  if (credValue.trim().startsWith("{")) {
    // Treat as raw JSON string
    try {
      credentials = JSON.parse(credValue);
    } catch (err: any) {
      throw new Error(`Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON raw string: ${err.message}`);
    }
  } else {
    // Treat as file path
    const resolvedPath = path.resolve(process.cwd(), credValue.trim());
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(
        `GOOGLE_SERVICE_ACCOUNT_JSON is specified as a file path, but no file was found at: ${resolvedPath}`
      );
    }
    try {
      credentials = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
    } catch (err: any) {
      throw new Error(`Failed to parse service account JSON file at ${resolvedPath}: ${err.message}`);
    }
  }

  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();

  if (!tokenResponse.token) {
    throw new Error("Failed to obtain GCP access token");
  }

  cachedToken = tokenResponse.token;
  tokenExpiry = Date.now() + 3_600_000; // tokens last 1 hour

  return cachedToken;
}
