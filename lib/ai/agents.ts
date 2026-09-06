import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOllama } from "@langchain/ollama";
import { getOllamaConfig, type OllamaRuntimeConfig } from "@/lib/ai/ollama-config";

export type AgentKey = "architect" | "debugger" | "refactorer" | "sentinel";
export type AgentMode =
  | "chat"
  | "review"
  | "fix"
  | "optimization"
  | "architect"
  | "debugger"
  | "refactorer"
  | "sentinel";

export interface AgentDefinition {
  key: AgentKey;
  name: string;
  model: string;
  description: string;
  systemPrompt: string;
}

export interface AgentRunRequest {
  message: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  mode?: AgentMode;
}

export interface AgentRunResponse {
  response: string;
  agent: string;
  model: string;
}

export const OLLAMA_CLOUD_BASE_URL = "https://ollama.com";

export const AGENT_CATALOG: Record<AgentKey, AgentDefinition> = {
  architect: {
    key: "architect",
    name: "The Architect",
    model: "",
    description:
      "Designs robust systems, scaffolds new features, and structures large codebases with maintainability in mind.",
    systemPrompt:
      "You are The Architect. Design clean, scalable, production-ready solutions. Prefer maintainable architecture, clear abstractions, and pragmatic implementations. Explain trade-offs, defaults, and the structure of the solution before writing code. Keep the response concise but technically solid.",
  },
  debugger: {
    key: "debugger",
    name: "The Debugger",
    model: "",
    description:
      "Diagnoses runtime failures, stack traces, and logic bugs and recommends exact fixes with confidence.",
    systemPrompt:
      "You are The Debugger. Analyze stack traces, failure logs, and broken code with surgical precision. Identify the root cause, explain the exact failing line or condition, and propose the minimal fix with practical validation steps. When code is involved, include the corrected snippet.",
  },
  refactorer: {
    key: "refactorer",
    name: "The Refactorer",
    model: "",
    description:
      "Improves readability, removes duplication, and tunes code for performance without changing behavior.",
    systemPrompt:
      "You are The Refactorer. Focus on cleaner architecture, reduced duplication, better naming, and performance. Refactor code while preserving behavior, and explain what improved and why. Prefer DRY patterns and maintainable abstractions.",
  },
  sentinel: {
    key: "sentinel",
    name: "The Sentinel",
    model: "",
    description:
      "Scans for security risks, missing guards, and edge-case issues before release.",
    systemPrompt:
      "You are The Sentinel. Review code for security weaknesses, unsafe assumptions, input validation gaps, and risk-prone patterns. Suggest hardened fixes and tests to reduce the chance of vulnerabilities before deployment.",
  },
};

export async function listAvailableModels(config: OllamaRuntimeConfig): Promise<string[]> {
  try {
    const response = await fetch(`${config.apiUrl}/api/tags`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${config.apiKey}` },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { models?: Array<{ name?: string }> };
    return (data.models ?? []).map((model) => model.name).filter(Boolean) as string[];
  } catch (error) {
    console.warn("Unable to reach Ollama for model discovery:", error);
    return [];
  }
}

function normalizeAgentMode(mode?: AgentMode): AgentKey {
  switch (mode) {
    case "fix":
    case "debugger":
      return "debugger";
    case "optimization":
    case "refactorer":
      return "refactorer";
    case "review":
    case "sentinel":
      return "sentinel";
    case "architect":
      return "architect";
    case "chat":
    default:
      return "architect";
  }
}

function selectAgentByMessage(message: string, mode?: AgentMode): AgentKey {
  const normalized = message.toLowerCase();
  const selectedMode = normalizeAgentMode(mode);

  if (/(stack trace|exception|error|bug|failed|cannot read|undefined|null|typeerror|panic|segmentation)/i.test(normalized)) {
    return "debugger";
  }

  if (/(security|vulnerab|auth|jwt|sanitize|xss|csrf|sql injection|injection|input validation|secret|token)/i.test(normalized)) {
    return "sentinel";
  }

  if (/(refactor|optimi[sz]e|dry|duplication|clean up|complexity|performance)/i.test(normalized)) {
    return "refactorer";
  }

  return selectedMode;
}

function messageContentToString(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item && typeof item.text === "string") {
          return item.text;
        }
        return JSON.stringify(item);
      })
      .join("\n");
  }

  if (content && typeof content === "object") {
    return JSON.stringify(content, null, 2);
  }

  return "";
}

function createModel(config: OllamaRuntimeConfig) {
  return new ChatOllama({
    model: config.model,
    baseUrl: config.apiUrl,
    headers: { Authorization: `Bearer ${config.apiKey}` },
    temperature: 0.2,
    topP: 0.9,
    numPredict: 1200,
  });
}

function buildPrompt(agent: AgentDefinition, message: string, history: Array<{ role: "user" | "assistant"; content: string }> = []) {
  const conversationContext = history.length
    ? history
        .slice(-8)
        .map((item) => `${item.role.toUpperCase()}: ${item.content}`)
        .join("\n\n")
    : "No earlier conversation.";

  return [
    `Agent: ${agent.name}`,
    `Model: ${agent.model}`,
    `Conversation context:\n${conversationContext}`,
    `User request:\n${message}`,
  ].join("\n\n");
}

export async function runAgentWorkflow({ message, history = [], mode, userId }: AgentRunRequest & { userId: string }): Promise<AgentRunResponse> {
  const ollamaConfig = await getOllamaConfig(userId);
  const agentKey = selectAgentByMessage(message, mode);
  const agent = { ...AGENT_CATALOG[agentKey], model: ollamaConfig.model };
  const llm = createModel(ollamaConfig);
  const prompt = buildPrompt(agent, message, history);

  const response = await llm.invoke([
    new SystemMessage(agent.systemPrompt),
    new HumanMessage(prompt),
  ]);

  const content = messageContentToString(response.content);

  return {
    response: content.trim() || "No response generated.",
    agent: agent.name,
    model: agent.model,
  };
}

export function getAvailableAgents() {
  return Object.values(AGENT_CATALOG).map(({ key, name, description }) => ({
    key,
    name,
    description,
  }));
}
