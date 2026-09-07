import { db } from "@/lib/db";

const MAX_MEMORY_LENGTH = 6000;

export async function getAgentMemory(userId: string) {
  const memory = await db.agentMemory.findUnique({
    where: { userId },
    select: { summary: true },
  });
  return memory?.summary || "";
}

export async function getAgentHistory(userId: string, limit = 30) {
  const messages = await db.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { role: true, content: true, createdAt: true },
  });

  return messages.reverse().map(({ role, content }) => ({
    role: role === "assistant" ? "assistant" as const : "user" as const,
    content,
  }));
}

export async function saveAgentExchange(
  userId: string,
  userMessage: string,
  assistantMessage: string,
) {
  await db.chatMessage.createMany({
    data: [
      { userId, role: "user", content: userMessage },
      { userId, role: "assistant", content: assistantMessage },
    ],
  });

  const durableContext = [userMessage, assistantMessage]
    .filter((value) => /\b(i prefer|i use|we use|my project|remember|always|never)\b/i.test(value))
    .join("\n");

  if (!durableContext) return;

  const current = await getAgentMemory(userId);
  const summary = `${current}\n${durableContext}`.trim().slice(-MAX_MEMORY_LENGTH);
  await db.agentMemory.upsert({
    where: { userId },
    create: { userId, summary },
    update: { summary },
  });
}