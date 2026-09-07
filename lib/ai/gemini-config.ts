import { db } from "@/lib/db";
import { decryptOllamaApiKey } from "@/lib/ai/ollama-config";

export interface GeminiRuntimeConfig {
  apiKey: string;
  model: string;
}

export async function getGeminiConfig(userId: string): Promise<GeminiRuntimeConfig | null> {
  const config = await db.ollamaConfig.findUnique({
    where: { userId },
    select: { encryptedGeminiApiKey: true, geminiModel: true },
  });

  if (!config?.encryptedGeminiApiKey || !config.geminiModel) {
    return null;
  }

  return {
    apiKey: decryptOllamaApiKey(config.encryptedGeminiApiKey),
    model: config.geminiModel,
  };
}