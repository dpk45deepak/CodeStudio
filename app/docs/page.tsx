import React from "react";
// Assuming you have these components exported from your main layout or components folder
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import FloatingBackground from "@/components/FloatingBackground";
import { BookOpen, Cpu, Code2, Keyboard, Terminal } from "lucide-react";

export default function DocsPage() {
    const sections = [
        {
            icon: Cpu,
            color: "blue",
            title: "Local Ollama AI Integration",
            content: `CodeStudio uses a locally installed Ollama model to provide real-time AI coding assistance without sending your code to external servers. This ensures privacy, faster responses, and offline capability.`,
        },
        {
            icon: Code2,
            color: "emerald",
            title: "AI Code Suggestions",
            content: `The AI can suggest code completions, explain errors, generate functions, and refactor existing code. Suggestions appear inline while typing inside the editor.`,
        },
        {
            icon: BookOpen,
            color: "purple",
            title: "How It Works",
            content: `The Monaco Editor sends your current file context to the local Ollama API. The model processes it and returns suggestions instantly inside the editor interface.`,
        },
        {
            icon: Keyboard,
            color: "cyan",
            title: "Editor Shortcuts",
            content: `CodeStudio supports powerful Monaco Editor shortcuts to improve productivity while coding. Master these to navigate your workspace at lightspeed.`,
        },
    ];

    const shortcuts = [
        { key: "Ctrl + Space", action: "Trigger AI Code Suggestion" },
        { key: "Ctrl + Enter", action: "Accept AI Suggestion" },
        { key: "Ctrl + /", action: "Toggle Comment" },
        { key: "Ctrl + D", action: "Select Next Match" },
        { key: "Alt + ↑ / ↓", action: "Move Line Up/Down" },
        { key: "Ctrl + Shift + F", action: "Global Search" },
        { key: "Ctrl + Shift + P", action: "Command Palette" },
    ];

    // Helper to map color strings to your design system's Tailwind classes
    const getColorClasses = (color: string): string => {
        const map: Record<string, string> = {
            blue: "bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:border-blue-500/40",
            emerald:
                "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:border-emerald-500/40",
            purple: "bg-purple-500/10 border-purple-500/20 text-purple-400 group-hover:border-purple-500/40",
            cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 group-hover:border-cyan-500/40",
        };
        return map[color] || map.blue;
    };

    return (
        <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-50 selection:bg-blue-500/30 overflow-x-hidden font-sans">
            {/* <Navbar session={session} /> */}

            <main className="grow pt-32 pb-20 px-6 relative flex flex-col items-center">
                {/* Background Effects (Reused from your Landing Page) */}
                {/* <FloatingBackground /> */}
                <div className="absolute top-0 w-full h-125 bg-linear-to-b from-blue-500/10 to-transparent blur-3xl pointer-events-none z-0" />

                <div className="relative z-20 max-w-5xl w-full">
                    {/* HEADER */}
                    <div className="text-center mb-20 flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-md mb-6">
                            <BookOpen className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
                                Official Documentation
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                            Master your{" "}
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-indigo-400 to-cyan-500 drop-shadow-sm">
                                Workspace.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                            Learn how CodeStudio’s AI-powered core works with
                            your local{" "}
                            <strong className="text-slate-200 font-semibold">
                                Ollama
                            </strong>{" "}
                            model to provide intelligent assistance and powerful
                            shortcuts.
                        </p>
                    </div>

                    {/* ARCHITECTURE / FEATURES GRID */}
                    <div className="grid md:grid-cols-2 gap-6 mb-24">
                        {sections.map((sec, i) => {
                            const Icon = sec.icon;
                            const colorStyle = getColorClasses(sec.color);

                            return (
                                <div
                                    key={i}
                                    className="group p-8 bg-linear-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl shadow-xl hover:border-slate-700 transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
                                >
                                    <div
                                        className={`w-14 h-14 border rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${colorStyle}`}
                                    >
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-slate-100">
                                        {sec.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        {sec.content}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* SHORTCUTS TERMINAL-STYLE PANEL */}
                    <div className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
                        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <Terminal className="w-5 h-5 text-slate-400" />
                                <h2 className="text-lg font-semibold text-slate-200">
                                    Editor Keyboard Shortcuts
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-700" />
                                <div className="w-3 h-3 rounded-full bg-slate-700" />
                                <div className="w-3 h-3 rounded-full bg-slate-700" />
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="grid gap-2">
                                {shortcuts.map((s, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700/50"
                                    >
                                        <span className="text-slate-300 font-medium mb-2 sm:mb-0">
                                            {s.action}
                                        </span>
                                        <div className="flex gap-1">
                                            {s.key
                                                .split(" + ")
                                                .map((keyPart, index) => (
                                                    <React.Fragment key={index}>
                                                        <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-700 text-sm font-mono text-blue-400 shadow-inner">
                                                            {keyPart}
                                                        </span>
                                                        {index <
                                                            s.key.split(" + ")
                                                                .length -
                                                                1 && (
                                                            <span className="text-slate-600 self-center text-xs">
                                                                +
                                                            </span>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* <Footer /> */}
        </div>
    );
}
