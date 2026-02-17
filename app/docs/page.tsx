import { BookOpen, Cpu, Code2, Keyboard } from "lucide-react";

export default function DocsPage() {
  const sections = [
    {
      icon: Cpu,
      title: "Local Ollama AI Integration",
      content: `SyntaxLab uses a locally installed Ollama model to provide real‑time AI coding assistance without sending your code to external servers. This ensures privacy, faster responses, and offline capability.`
    },
    {
      icon: Code2,
      title: "AI Code Suggestions",
      content: `The AI can suggest code completions, explain errors, generate functions, and refactor existing code. Suggestions appear inline while typing inside the editor.`
    },
    {
      icon: BookOpen,
      title: "How It Works",
      content: `The Monaco Editor sends your current file context to the local Ollama API. The model processes it and returns suggestions instantly inside the editor interface.`
    },
    {
      icon: Keyboard,
      title: "Editor Shortcuts",
      content: `SyntaxLab supports powerful Monaco Editor shortcuts to improve productivity while coding.`
    }
  ];

  const shortcuts = [
    { key: "Ctrl + Space", action: "Trigger AI Code Suggestion" },
    { key: "Ctrl + Enter", action: "Accept AI Suggestion" },
    { key: "Ctrl + /", action: "Toggle Comment" },
    { key: "Ctrl + D", action: "Select Next Match" },
    { key: "Alt + ↑ / ↓", action: "Move Line Up/Down" },
    { key: "Ctrl + Shift + F", action: "Global Search" },
    { key: "Ctrl + Shift + P", action: "Command Palette" }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-400 to-indigo-400">
            SyntaxLab Documentation
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Learn how SyntaxLab’s AI‑powered code editor works with your local
            Ollama model to provide intelligent coding assistance and powerful
            Monaco Editor shortcuts.
          </p>
        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-2 gap-10 mb-20">
          {sections.map((sec, i) => {
            const Icon = sec.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-teal-500/40 transition"
              >
                <Icon className="w-10 h-10 text-teal-400 mb-5" />
                <h3 className="text-xl font-semibold mb-3">{sec.title}</h3>
                <p className="text-gray-400 leading-relaxed">{sec.content}</p>
              </div>
            );
          })}
        </div>

        {/* SHORTCUT TABLE */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-8">Editor Keyboard Shortcuts</h2>

          <div className="space-y-4">
            {shortcuts.map((s, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-gray-800 pb-4"
              >
                <span className="font-mono text-teal-400">{s.key}</span>
                <span className="text-gray-300">{s.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
