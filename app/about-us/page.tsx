"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Rocket,
    Code2,
    HeartHandshake,
    Github,
    User,
} from "lucide-react";
import Link from "next/link";
import FloatingIcons from "@/components/Animation/FloatingIcons";

export default function AboutUs() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-start px-6 pt-32 pb-20 overflow-hidden bg-slate-950 text-slate-50 selection:bg-blue-500/30 font-sans">
            {/* BACKGROUND EFFECTS */}
            <div className="absolute top-0 w-full h-125 bg-linear-to-b from-blue-500/10 to-transparent blur-3xl pointer-events-none z-0" />

            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
                <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] rounded-full bg-emerald-900/10 blur-[80px]" />
            </div>

            <FloatingIcons />

            {/* HERO SECTION */}
            <div className="relative z-20 flex flex-col items-center text-center max-w-5xl w-full">
                {/* GLOWING BADGE */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-blue-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(45,212,191,0.2)] mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-xs font-mono font-medium text-blue-300 uppercase tracking-wider">
                        System.Info // About The Project
                    </span>
                </div>

                {/* MAIN HEADING */}
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                    Building the future of <br className="hidden md:block" />
                    <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-indigo-400 to-cyan-500 drop-shadow-sm">
                        Collaborative Code.
                    </span>
                </h1>

                {/* DESCRIPTION */}
                <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed font-light">
                    Created by{" "}
                    <strong className="text-slate-200 font-semibold">
                        Deepak Kumar
                    </strong>
                    , CodeStudio is an open-source platform built for developers
                    who believe in learning, building, and growing together. Our
                    mission is to empower teams and individuals to ship better
                    software faster through real-time collaboration and local
                    AI.
                </p>
            </div>

            {/* VALUES / FEATURES GRID */}
            <div className="relative z-20 grid md:grid-cols-3 gap-6 mt-20 max-w-6xl w-full">
                {[
                    {
                        icon: Code2,
                        title: "Collaborative Coding",
                        desc: "Work together in real-time, share ideas instantly, and build projects faster as a synchronized team.",
                        color: "text-blue-400",
                        bg: "bg-blue-500/10 border-blue-500/20",
                    },
                    {
                        icon: Rocket,
                        title: "Innovation First",
                        desc: "We focus on cutting-edge tools like on-device LLMs that help developers innovate and stay ahead of the curve.",
                        color: "text-purple-400",
                        bg: "bg-purple-500/10 border-purple-500/20",
                    },
                    {
                        icon: HeartHandshake,
                        title: "Community Driven",
                        desc: "A supportive, open ecosystem where knowledge is shared freely and every developer can grow together.",
                        color: "text-emerald-400",
                        bg: "bg-emerald-500/10 border-emerald-500/20",
                    },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="p-8 bg-linear-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl shadow-xl hover:border-slate-700 transition-all duration-300 group backdrop-blur-sm"
                    >
                        <div
                            className={`w-14 h-14 ${item.bg} border rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                        >
                            <item.icon className={`w-7 h-7 ${item.color}`} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-100">
                            {item.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>

            {/* OPEN SOURCE & AUTHOR SECTION */}
            <div className="relative z-20 mt-12 w-full max-w-6xl bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col md:flex-row">
                <div className="flex-1 p-8 md:p-12 md:border-r border-slate-800/50">
                    <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-6">
                        <Github className="w-6 h-6 text-slate-100" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-4">
                        Open Source at Heart
                    </h2>
                    <p className="text-slate-400 leading-relaxed mb-8">
                        CodeStudio is completely open-source. Dive into the
                        codebase, submit pull requests, report issues, or fork
                        it to build your own custom IDE environments.
                    </p>
                    <Link
                        href="https://github.com/dpk45deepak/CodeStudio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors group"
                    >
                        View Repository on GitHub
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="md:w-[40%] bg-slate-950/50 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center shadow-inner">
                            <User className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-100">
                                Deepak Kumar
                            </h3>
                            <p className="text-sm font-mono text-slate-500">
                                Creator & Lead Maintainer
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed italic">
                        Built to bridge the gap between heavy cloud IDEs and
                        strictly local environments. Powered by community, for
                        the community
                    </p>
                </div>
            </div>

            {/* CTA SECTION */}
            <div className="relative z-20 mt-24 flex flex-col items-center text-center">
                <Link href="/dashboard">
                    <Button
                        size="lg"
                        className="group relative h-14 px-8 text-base font-semibold rounded-full bg-slate-50 text-slate-950 hover:bg-blue-400 hover:text-slate-950 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:scale-105 border-none"
                    >
                        Launch Workspace
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
