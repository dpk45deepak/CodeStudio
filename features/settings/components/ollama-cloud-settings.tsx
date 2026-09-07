"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Cloud, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEFAULT_API_URL = "https://ollama.com";

export function OllamaCloudSettings() {
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [geminiModel, setGeminiModel] = useState("gemini-2.5-flash");
  const [geminiConfigured, setGeminiConfigured] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings/ollama")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load Ollama settings");
        return response.json();
      })
      .then((data) => {
        if (data.config) {
          setApiUrl(data.config.apiUrl);
          setModel(data.config.model);
          setConfigured(true);
          setGeminiModel(data.config.geminiModel || "gemini-2.5-flash");
          setGeminiConfigured(Boolean(data.config.geminiConfigured));
        }
      })
      .catch(() => setMessage("Unable to load Ollama Cloud settings."))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/settings/ollama", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiUrl, apiKey, model, geminiApiKey, geminiModel }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save settings");

      setConfigured(true);
      setGeminiConfigured(Boolean(geminiApiKey || geminiConfigured));
      setApiKey("");
      setGeminiApiKey("");
      setMessage("Ollama Cloud settings saved securely.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save settings.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl backdrop-blur-sm">
      <div className="mb-8 flex items-center gap-4 border-b border-slate-800/50 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
          <Cloud className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Ollama Cloud</h2>
          <p className="text-sm font-medium text-slate-400">
            Connect chat and code suggestions to your Ollama Cloud account.
          </p>
        </div>
        {configured && (
          <div className="ml-auto flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Connected
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="space-y-2">
          <Label htmlFor="ollama-api-url" className="text-slate-300">Ollama Cloud API URL</Label>
          <Input
            id="ollama-api-url"
            type="url"
            required
            value={apiUrl}
            onChange={(event) => setApiUrl(event.target.value)}
            placeholder={DEFAULT_API_URL}
            className="border-slate-700 bg-slate-950/50 text-slate-100"
          />
        </div>
        <div className="border-t border-slate-800/50 pt-6">
          <h3 className="text-lg font-semibold text-slate-100">Gemini Agents</h3>
          <p className="mt-1 text-sm text-slate-400">
            Gemini powers agent work such as architecture, debugging, refactoring, and security reviews.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gemini-api-key" className="text-slate-300">Gemini API key</Label>
          <Input
            id="gemini-api-key"
            type="password"
            value={geminiApiKey}
            onChange={(event) => setGeminiApiKey(event.target.value)}
            placeholder={geminiConfigured ? "Leave blank to keep the saved key" : "Your Google AI Studio API key"}
            className="border-slate-700 bg-slate-950/50 text-slate-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gemini-model" className="text-slate-300">Gemini model</Label>
          <Input
            id="gemini-model"
            required
            value={geminiModel}
            onChange={(event) => setGeminiModel(event.target.value)}
            placeholder="gemini-2.5-flash"
            className="border-slate-700 bg-slate-950/50 text-slate-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ollama-api-key" className="text-slate-300">API key</Label>
          <Input
            id="ollama-api-key"
            type="password"
            required={!configured}
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder={configured ? "Leave blank to keep the saved key" : "Your Ollama Cloud API key"}
            className="border-slate-700 bg-slate-950/50 text-slate-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ollama-model" className="text-slate-300">Model</Label>
          <Input
            id="ollama-model"
            required
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder="e.g. gpt-oss:120b"
            className="border-slate-700 bg-slate-950/50 text-slate-100"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isLoading || isSaving} className="gap-2 bg-blue-600 text-white hover:bg-blue-500">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Ollama Cloud settings
          </Button>
          {message && <p className="text-sm text-slate-400" role="status">{message}</p>}
        </div>
      </form>
    </section>
  );
}