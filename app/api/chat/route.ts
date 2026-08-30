import { type NextRequest, NextResponse } from "next/server";
import { OLLAMA_BASE_URL, getAvailableAgents, runAgentWorkflow } from "@/lib/ai/agents";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface EnhancePromptRequest {
  prompt: string;
  context?: {
    fileName?: string;
    language?: string;
    codeContent?: string;
  };
}

async function enhancePrompt(request: EnhancePromptRequest) {
  const enhancementPrompt = `You are a prompt enhancement assistant. Improve the user's prompt for a local code-focused AI agent without changing intent.

Original prompt: "${request.prompt}"

Context: ${request.context ? JSON.stringify(request.context, null, 2) : "No additional context"}

Return only the enhanced prompt text.`;

  try {
    const { response } = await runAgentWorkflow({
      message: enhancementPrompt,
      mode: "architect",
    });

    return response.trim() || request.prompt;
  } catch (error) {
    console.error("Prompt enhancement error:", error);
    return request.prompt;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === "enhance") {
      const enhancedPrompt = await enhancePrompt(body as EnhancePromptRequest);
      return NextResponse.json({ enhancedPrompt });
    }

    const { message, history, mode } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 });
    }

    const validHistory: ChatMessage[] = Array.isArray(history)
      ? history.filter(
          (msg: unknown): msg is ChatMessage =>
            typeof msg === "object" &&
            msg !== null &&
            "role" in msg &&
            "content" in msg &&
            typeof (msg as ChatMessage).role === "string" &&
            typeof (msg as ChatMessage).content === "string" &&
            ["user", "assistant"].includes((msg as ChatMessage).role),
        )
      : [];

    const aiResponse = await runAgentWorkflow({
      message,
      history: validHistory.slice(-10),
      mode,
    });

    return NextResponse.json({
      response: aiResponse.response,
      agent: aiResponse.agent,
      model: aiResponse.model,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in AI chat route:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "AI Chat API is running",
    timestamp: new Date().toISOString(),
    baseUrl: OLLAMA_BASE_URL,
    agents: getAvailableAgents(),
    info: "Use POST to send chat messages or enhance prompts. Ensure the selected local Ollama model is already pulled.",
  });
}
