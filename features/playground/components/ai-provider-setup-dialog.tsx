"use client";

import { FormEvent, useEffect, useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Provider = "ollama" | "gemini";

interface AIProviderSetupDialogProps {
  open: boolean;
  provider: Provider;
  onOpenChange: (open: boolean) => void;
  onSaved: (provider: Provider) => void;
}

interface ProviderSettings {
  apiUrl: string;
  model: string;
  geminiModel: string;
  ollamaConfigured: boolean;
  geminiConfigured: boolean;
}

const defaultSettings: ProviderSettings = {
  apiUrl: "https://ollama.com",
  model: "",
  geminiModel: "gemini-2.5-flash",
  ollamaConfigured: false,
  geminiConfigured: false,
};

export function AIProviderSetupDialog({
  open,
  provider,
  onOpenChange,
  onSaved,
}: AIProviderSetupDialogProps) {
  const [settings, setSettings] = useState(defaultSettings);
  const [ollamaApiKey, setOllamaApiKey] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;

    fetch("/api/settings/ollama")
      .then((response) => response.json())
      .then((data) => {
        if (!data.config) return;
        setSettings({
          apiUrl: data.config.apiUrl || defaultSettings.apiUrl,
          model: data.config.model || "",
          geminiModel: data.config.geminiModel || defaultSettings.geminiModel,
          ollamaConfigured: Boolean(data.config.apiUrl && data.config.model),
          geminiConfigured: Boolean(data.config.geminiConfigured),
        });
      })
      .catch(() => setMessage("Unable to load saved AI settings."));
  }, [open]);

  const isOllamaRequired = !settings.ollamaConfigured;
  const isGeminiRequired = provider === "gemini" && !settings.geminiConfigured;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/settings/ollama", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiUrl: settings.apiUrl,
          apiKey: ollamaApiKey,
          model: settings.model,
          geminiApiKey,
          geminiModel: settings.geminiModel,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save AI settings");

      setOllamaApiKey("");
      setGeminiApiKey("");
      onSaved(provider);
      onOpenChange(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save AI settings");
    } finally {
      setIsLoading(false);
    }
  }

  const providerName = provider === "gemini" ? "Gemini agents" : "Ollama inline suggestions";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-950 text-slate-100 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-blue-400" />
            Connect {providerName}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Your keys are encrypted before they are stored. They are only used on the server for your AI requests.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dashboard-ollama-url">Ollama Cloud URL</Label>
            <Input
              id="dashboard-ollama-url"
              type="url"
              required
              value={settings.apiUrl}
              onChange={(event) => setSettings((current) => ({ ...current, apiUrl: event.target.value }))}
              className="border-slate-700 bg-slate-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dashboard-ollama-key">Ollama API key</Label>
            <Input
              id="dashboard-ollama-key"
              type="password"
              required={isOllamaRequired}
              value={ollamaApiKey}
              onChange={(event) => setOllamaApiKey(event.target.value)}
              placeholder={isOllamaRequired ? "Required for inline suggestions" : "Leave blank to keep saved key"}
              className="border-slate-700 bg-slate-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dashboard-ollama-model">Ollama model</Label>
            <Input
              id="dashboard-ollama-model"
              required
              value={settings.model}
              onChange={(event) => setSettings((current) => ({ ...current, model: event.target.value }))}
              placeholder="gpt-oss:120b"
              className="border-slate-700 bg-slate-900"
            />
          </div>
          <div className="border-t border-slate-800 pt-4">
            <div className="mb-3">
              <h3 className="font-medium">Gemini agent key</h3>
              <p className="text-xs text-slate-400">Used by Open Agents for coding help and reviews.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dashboard-gemini-key">Gemini API key</Label>
              <Input
                id="dashboard-gemini-key"
                type="password"
                required={isGeminiRequired}
                value={geminiApiKey}
                onChange={(event) => setGeminiApiKey(event.target.value)}
                placeholder={isGeminiRequired ? "Required for Open Agents" : "Leave blank to keep saved key"}
                className="border-slate-700 bg-slate-900"
              />
            </div>
            <div className="mt-3 space-y-2">
              <Label htmlFor="dashboard-gemini-model">Gemini model</Label>
              <Input
                id="dashboard-gemini-model"
                required
                value={settings.geminiModel}
                onChange={(event) => setSettings((current) => ({ ...current, geminiModel: event.target.value }))}
                placeholder="gemini-2.5-flash"
                className="border-slate-700 bg-slate-900"
              />
            </div>
          </div>
          {message && <p className="text-sm text-red-400" role="alert">{message}</p>}
          <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save AI credentials
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}