import crypto from "node:crypto";
import { db } from "@/lib/db";

export interface OllamaRuntimeConfig {
  apiUrl: string;
  apiKey: string;
  model: string;
}

const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey() {
  const secret = process.env.OLLAMA_CONFIG_ENCRYPTION_KEY || process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("OLLAMA_CONFIG_ENCRYPTION_KEY or AUTH_SECRET must be configured");
  }

  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptOllamaApiKey(apiKey: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(apiKey, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64url");
}

export function decryptOllamaApiKey(value: string) {
  const payload = Buffer.from(value, "base64url");
  const iv = payload.subarray(0, IV_LENGTH);
  const authTag = payload.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = payload.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, getEncryptionKey(), iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

export async function getOllamaConfig(userId: string): Promise<OllamaRuntimeConfig> {
  const config = await db.ollamaConfig.findUnique({ where: { userId } });
  if (!config) {
    throw new Error("Ollama Cloud is not configured. Add your Ollama Cloud settings first.");
  }

  return {
    apiUrl: config.apiUrl.replace(/\/$/, "").replace(/\/api$/, ""),
    apiKey: decryptOllamaApiKey(config.encryptedApiKey),
    model: config.model,
  };
}