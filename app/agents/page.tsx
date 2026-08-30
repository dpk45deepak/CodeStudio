"use client";

import React from "react";
import { 
    Bot, 
    SearchCode, 
    ShieldAlert, 
    Zap, 
    Cpu, 
    Layers, 
    Terminal,
    Wrench
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AgentsPage() {
    const agents = [
        {
            name: "The Architect",
            model: "llama3:8b",
            icon: Layers,
            color: "blue",
            bg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
            description: "Specializes in system design, boilerplate generation, and structuring large-scale monorepos. Best used at the start of a project.",
        },
        {
            name: "The Debugger",
            model: "deepseek-coder",
            icon: SearchCode,
            color: "emerald",
            bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
            description: "Feeds on stack traces. Instantly analyzes error logs and highlights the exact line of failure with suggested fixes.",
        },
        {
            name: "The Refactorer",
            model: "qwen2.5-coder",
            icon: Wrench,
            color: "purple",
            bg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
            description: "Cleans up messy code. Optimizes for time complexity, removes redundancies, and enforces strict DRY principles.",
        },
        {
            name: "The Sentinel",
            model: "phi3:mini",
            icon: ShieldAlert,
            color: "cyan",
            bg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
            description: "Your local security scanner. Operates with zero latency to write unit tests and detect vulnerabilities before you commit.",
        },
    ];

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-start px-6 pt-32 pb-20 overflow-hidden font-sans">
            
            {/* BACKGROUND EFFECTS */}
            <div className="absolute top-0 w-full h-125 bg-linear-to-b from-blue-500/10 to-transparent blur-3xl pointer-events-none z-0" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] left-[-10%] w-[30%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
            </div>

            {/* HERO SECTION */}
            <div className="relative z-20 flex flex-col items-center text-center max-w-4xl w-full mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
                        System.Roster // Active Agents
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-100">
                    Meet your local{" "}
                    <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-sm">
                        Development Team.
                    </span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light max-w-2xl">
                    CodeStudio seamlessly routes your prompts to specialized, locally hosted AI models. 
                    Zero latency. Zero privacy concerns. Absolute control.
                </p>
            </div>

            {/* AGENTS GRID */}
            <div className="relative z-20 grid md:grid-cols-2 gap-6 max-w-6xl w-full mb-24">
                {agents.map((agent, i) => (
                    <div
                        key={i}
                        className="group p-8 bg-slate-900/50 border border-slate-800 rounded-3xl shadow-xl hover:border-slate-700 transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
                    >
                        {/* Subtle Hover Glow on Card */}
                        <div className={`absolute -inset-px opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${
                            agent.color === 'blue' ? 'bg-blue-500' :
                            agent.color === 'emerald' ? 'bg-emerald-500' :
                            agent.color === 'purple' ? 'bg-purple-500' : 'bg-cyan-500'
                        }`} />

                        <div className="flex items-start justify-between mb-6 relative z-10">
                            <div className={`w-14 h-14 ${agent.bg} border rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <agent.icon className="w-7 h-7" />
                            </div>
                            
                            {/* Model Badge */}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 shadow-inner">
                                <Cpu className="w-3 h-3 text-slate-400" />
                                <span className="text-xs font-mono text-slate-300">
                                    {agent.model}
                                </span>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-3 text-slate-100 group-hover:text-white transition-colors">
                                {agent.name}
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                {agent.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* HARDWARE REQUIREMENTS / TERMINAL */}
            <div className="relative z-20 w-full max-w-4xl bg-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm mb-12">
                <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-slate-400" />
                        <h2 className="text-lg font-semibold text-slate-200">
                            Engine Requirements
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-md border border-slate-800">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        Ollama Core
                    </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-4">
                        <h3 className="text-xl font-bold text-slate-100">Powered by your Hardware</h3>
                        <p className="text-slate-400 leading-relaxed">
                            To utilize the multi-agent system, ensure you have Ollama installed and running on your local machine. CodeStudio will automatically detect available models and route tasks accordingly.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500 pt-2 font-mono">
                            <span className="text-blue-400">$</span> ollama serve
                        </div>
                    </div>
                    
                    <div className="shrink-0">
                        <Link href="/docs">
                            <Button variant="secondary" className="bg-slate-800 text-white hover:bg-slate-700 border-none h-12 px-6">
                                View Setup Guide
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}