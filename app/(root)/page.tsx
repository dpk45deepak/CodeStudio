import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth-edge";
import {
    ArrowRight,
    Sparkles,
    Terminal,
    Users,
    ShieldCheck,
    Bot,
    Cpu,
    Code2,
    Github,
} from "lucide-react";

// ==========================================
// 1. NAVIGATION BAR COMPONENT
// ==========================================
const Navbar = ({ session }: { session: object | null }) => (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-100">
                    Code<span className="text-blue-400">Studio</span>
                </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                <Link
                    href="agents"
                    className="hover:text-blue-400 transition-colors"
                >
                    Multi-Agent
                </Link>
                <Link
                    href="#features"
                    className="hover:text-blue-400 transition-colors"
                >
                    Features
                </Link>
                <Link
                    href="docs"
                    className="hover:text-blue-400 transition-colors"
                >
                    Documentation
                </Link>
                <Link
                    href="about-us"
                    className="hover:text-blue-400 transition-colors"
                >
                    About Us
                </Link>
            </nav>

            <div className="flex items-center gap-4">
                <Link
                    href="https://github.com/dpk45deepak/CodeStudio"
                    target="_blank"
                    className="hidden sm:flex text-slate-400 hover:text-white transition-colors"
                >
                    <Github className="w-5 h-5" />
                </Link>

                {session ? (
                    <Link href="/dashboard">
                        <Button
                            variant="secondary"
                            className="bg-slate-800 text-white hover:bg-slate-700 border-none"
                        >
                            Dashboard
                        </Button>
                    </Link>
                ) : (
                    <Link href="/auth/sign-in">
                        <Button className="bg-blue-500 text-slate-950 hover:bg-blue-400 font-semibold shadow-[0_0_15px_rgba(45,212,191,0.2)] border-none">
                            Sign In
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    </header>
);

// ==========================================
// 2. FOOTER COMPONENT
// ==========================================
const Footer = () => (
    <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8 z-20 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-sm">
                <Link href="/" className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="font-bold text-lg text-slate-100">
                        CodeStudio
                    </span>
                </Link>
                <p className="text-slate-400 text-sm leading-relaxed">
                    The ultimate cloud-based code editor powered by local
                    multi-agent AI. Build faster, privately, and
                    collaboratively.
                </p>
            </div>

            <div className="flex gap-16 text-sm">
                <div className="flex flex-col gap-3">
                    <h4 className="font-semibold text-slate-100 mb-2">
                        Product
                    </h4>
                    <Link
                        href="#"
                        className="text-slate-400 hover:text-blue-400"
                    >
                        Features
                    </Link>
                    <Link
                        href="#"
                        className="text-slate-400 hover:text-blue-400"
                    >
                        Ollama Setup
                    </Link>
                    <Link
                        href="#"
                        className="text-slate-400 hover:text-blue-400"
                    >
                        Pricing
                    </Link>
                </div>
                <div className="flex flex-col gap-3">
                    <h4 className="font-semibold text-slate-100 mb-2">Legal</h4>
                    <Link
                        href="#"
                        className="text-slate-400 hover:text-blue-400"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="#"
                        className="text-slate-400 hover:text-blue-400"
                    >
                        Terms of Service
                    </Link>
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} CodeStudio. All rights reserved.</p>
            <p>Built with Next.js & Ollama</p>
        </div>
    </footer>
);

// ==========================================
// 3. BACKGROUND ANIMATION COMPONENT
// ==========================================
const FloatingBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] rounded-full bg-emerald-900/10 blur-[80px]" />
    </div>
);

// ==========================================
// 4. MAIN PAGE COMPONENT (EXPORT DEFAULT)
// ==========================================
export default async function Home() {
    const session = await auth();

    return (
        <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-50 selection:bg-blue-500/30 overflow-x-hidden font-sans">
            {/* Global Navigation */}
            <Navbar session={session} />

            {/* Main Content Area */}
            <main className="grow pt-32 pb-20 px-6 relative flex flex-col items-center">
                {/* Background Effects */}
                <FloatingBackground />
                <div className="absolute top-0 w-full h-125 bg-linear-to-b from-blue-500/10 to-transparent blur-3xl pointer-events-none z-0" />

                {/* HERO SECTION */}
                <div className="relative z-20 flex flex-col items-center text-center max-w-5xl w-full">
                    {/* Glowing Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-blue-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(45,212,191,0.2)] mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-xs font-mono font-medium text-blue-300 uppercase tracking-wider">
                            CodeStudio Multi-Agent Engine v1.0
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                        Code infinitely with <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-indigo-400 to-cyan-500 drop-shadow-sm">
                            Local Multi-Agent AI.
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed font-light">
                        Experience the future of development.{" "}
                        <strong className="text-slate-200 font-semibold">
                            DevTgthr
                        </strong>{" "}
                        bridges real-time cloud collaboration with the raw,
                        uncensored power of local{" "}
                        <strong className="text-slate-200">Ollama</strong>{" "}
                        models to code alongside infinite AI agents.
                    </p>

                    {/* Terminal-Style Ollama Setup */}
                    <div className="mt-10 w-full max-w-2xl text-left bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                                <Cpu className="w-3 h-3" /> Local Runtime
                                Required
                            </span>
                        </div>
                        <div className="p-5 font-mono text-sm space-y-3">
                            <p className="text-slate-300">
                                <span className="text-blue-400"># 1.</span>{" "}
                                Install Ollama locally for zero-latency agent
                                communication
                            </p>
                            <div className="flex items-center gap-3 p-3 bg-black/50 rounded-lg border border-slate-800">
                                <Terminal className="w-4 h-4 text-emerald-500" />
                                <code className="text-emerald-400">
                                    ollama run phi3
                                </code>
                            </div>
                            <p className="text-slate-500 text-xs mt-2">
                                * The multi-agent workspace routes all AI
                                requests directly to your local hardware. No API
                                limits. No code leaves your machine.
                            </p>
                        </div>
                    </div>

                    {/* Call To Action */}
                    <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
                        <Link href={session ? "/dashboard" : "/auth/sign-in"}>
                            <Button
                                size="lg"
                                className="group relative h-14 px-8 text-base font-semibold rounded-full bg-slate-50 text-slate-950 hover:bg-blue-400 hover:text-slate-950 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:scale-105 border-none"
                            >
                                {session
                                    ? "Launch Workspace"
                                    : "Initialize Environment"}
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/docs">
                            <Button
                                variant="ghost"
                                size="lg"
                                className="h-14 px-8 text-base font-medium rounded-full text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all border-none"
                            >
                                View Documentation
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* BENTO GRID FEATURES SECTION */}
                <div
                    id="features"
                    className="relative z-20 mt-32 w-full max-w-6xl"
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Built for the{" "}
                            <span className="text-blue-400">AI Era</span>
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            Traditional IDEs are passive. CodeStudio is an
                            active participant in your development lifecycle.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="md:col-span-2 p-8 bg-linear-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Bot className="w-32 h-32 text-blue-500" />
                            </div>
                            <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Sparkles className="w-7 h-7 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-slate-100">
                                Infinite Multi-Agent Coding
                            </h3>
                            <p className="text-slate-400 max-w-md leading-relaxed">
                                Spawn specialized AI agents for refactoring,
                                writing tests, or debugging simultaneously.
                                Powered entirely by your local Ollama instance
                                for limitless, free execution.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 bg-linear-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl shadow-xl">
                            <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Users className="w-7 h-7 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-100">
                                Cloud Sync
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                Invite human teammates. Share cursors and
                                terminals in real-time while local AI processes
                                the heavy lifting.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 bg-linear-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl shadow-xl">
                            <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck className="w-7 h-7 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-100">
                                Absolute Privacy
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                Your proprietary codebase never hits an external
                                API. All code analysis stays strictly on your
                                local hardware.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="md:col-span-2 p-8 bg-linear-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl shadow-xl">
                            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Code2 className="w-7 h-7 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-slate-100">
                                Monaco Editor Core
                            </h3>
                            <p className="text-slate-400 max-w-md leading-relaxed">
                                Built on the same foundation as VS Code. Enjoy
                                syntax highlighting, rich IntelliSense, and
                                multi-language support instantly in your
                                browser.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Global Footer */}
            <Footer />
        </div>
    );
}
