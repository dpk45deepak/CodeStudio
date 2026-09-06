import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { encryptOllamaApiKey } from "@/lib/ai/ollama-config";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const config = await db.ollamaConfig.findUnique({
    where: { userId: session.user.id },
    select: { apiUrl: true, model: true, updatedAt: true },
  });

  return NextResponse.json({
    configured: Boolean(config),
    config: config
      ? { apiUrl: config.apiUrl, model: config.model, updatedAt: config.updatedAt }
      : null,
  });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const body = await request.json();
  const apiUrl = typeof body.apiUrl === "string"
    ? body.apiUrl.trim().replace(/\/$/, "").replace(/\/api$/, "")
    : "";
  const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
  const model = typeof body.model === "string" ? body.model.trim() : "";

  if (!apiUrl || !apiKey || !model) {
    return NextResponse.json(
      { error: "Ollama Cloud API URL, API key, and model are required" },
      { status: 400 },
    );
  }

  try {
    new URL(apiUrl);
  } catch {
    return NextResponse.json({ error: "Enter a valid Ollama Cloud API URL" }, { status: 400 });
  }

  const existingConfig = await db.ollamaConfig.findUnique({
    where: { userId: session.user.id },
    select: { encryptedApiKey: true },
  });
  const encryptedApiKey = apiKey
    ? encryptOllamaApiKey(apiKey)
    : existingConfig?.encryptedApiKey;

  if (!encryptedApiKey) {
    return NextResponse.json({ error: "API key is required" }, { status: 400 });
  }

  const config = await db.ollamaConfig.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, apiUrl, encryptedApiKey, model },
    update: { apiUrl, encryptedApiKey, model },
    select: { apiUrl: true, model: true, updatedAt: true },
  });

  return NextResponse.json({ configured: true, config });
}