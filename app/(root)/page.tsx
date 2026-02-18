import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles, Code, Cpu, Users, AlertCircle } from "lucide-react";
import Link from "next/link";
import FloatingIcons from "@/components/Animation/FloatingIcons";
import { auth } from "@/auth-edge";

export default async function Home() {
  const session = await auth();
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start px-6 pt-20 overflow-hidden bg-background">
      <FloatingIcons />

      {/* HERO CONTENT */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-4xl">

        {/* BRAND BADGE */}
        <div className="flex items-center gap-2 text-sm font-semibold text-teal-300 bg-background border border-border px-5 py-2 rounded-full backdrop-blur-md shadow-lg">
          <Sparkles className="w-4 h-4 text-teal-400" />
          DevTgthr • SyntaxLab
        </div>

        {/* MAIN HEADING */}
        <h1 className="mt-8 text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.15]">
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-teal-400 to-indigo-400">
            Code Together.
          </span>
          <br />
          <span className="text-foreground">
            Build Smarter.
          </span>
        </h1>

        {/* DESCRIPTION */}
        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          <span className="font-semibold text-foreground">
            DevTgthr SyntaxLab
          </span>{" "}
          is a next-generation collaborative code editor with AI-powered suggestions. 
          Write, debug, and ship faster with real-time teamwork, intelligent
          code completion, and a seamless developer experience.
        </p>

        {/* AI REQUIREMENT NOTICE */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-2xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="text-left">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">AI Code Suggestion Requirement</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                To use AI code suggestions, you need <strong>Ollama</strong> installed locally with the <strong>Phi-3</strong> model. 
                Ollama enables on-device AI processing for privacy and speed.
              </p>
              <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                <strong>Setup:</strong> Install Ollama → Run <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">ollama pull phi3</code>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        {session ? (
          <Link href={"/dashboard"}>
            <Button
              size="lg"
              className="mt-12 text-lg px-10 py-7 rounded-xl bg-linear-to-r from-blue-400 via-teal-500 to-teal-600 hover:opacity-90 shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105"
            >
              Go to Dashboard
              <ArrowUpRight className="w-5 h-5 ml-3" />
            </Button>
          </Link>
        ) : (
          <Link href={"/auth/sign-in"}>
            <Button
              size="lg"
              className="mt-12 text-lg px-10 py-7 rounded-xl bg-linear-to-r from-blue-400 via-teal-500 to-teal-600 hover:opacity-90 shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105"
            >
              Get Started Now
              <ArrowUpRight className="w-5 h-5 ml-3" />
            </Button>
          </Link>
        )}
      </div>

      {/* FEATURES SECTION */}
      <div className="relative z-20 mt-32 w-full max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-teal-400 to-indigo-400">
            Powerful Features
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Collaborative Editing */}
          <div className="p-6 bg-card border border-border rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Collaboration</h3>
            <p className="text-muted-foreground">
              Code together with your team in real-time. See changes instantly, share cursors, and communicate seamlessly.
            </p>
          </div>

          {/* AI Code Suggestions */}
          <div className="p-6 bg-card border border-border rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Suggestions</h3>
            <p className="text-muted-foreground">
              Get intelligent code completion powered by local Phi-3 model. Fast, private, and works offline with Ollama.
            </p>
          </div>

          {/* Advanced Editor */}
          <div className="p-6 bg-card border border-border rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Advanced Code Editor</h3>
            <p className="text-muted-foreground">
              Syntax highlighting, IntelliSense, debugging tools, and support for 50+ programming languages.
            </p>
          </div>
        </div>
      </div>

      {/* PROJECT DETAILS */}
      <div className="relative z-20 mt-32 w-full max-w-4xl">
        <div className="p-8 bg-muted/30 border border-border rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">About SyntaxLab</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              <strong>SyntaxLab</strong> is an open-source collaborative code editor designed for modern development teams. 
              Built with Next.js and powered by cutting-edge AI technology, it provides a complete development environment 
              in your browser.
            </p>
            <p>
              Unlike traditional IDEs, SyntaxLab runs entirely in the cloud while keeping your AI processing local through 
              Ollama. This unique approach ensures both collaboration and privacy - your code never leaves your environment 
              while still benefiting from AI assistance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Key Technologies:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Next.js 14 with App Router</li>
                  <li>• Real-time WebRTC collaboration</li>
                  <li>• Ollama + Phi-3 for AI</li>
                  <li>• Monaco Editor core</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Perfect for:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Team programming sessions</li>
                  <li>• Code reviews and pair programming</li>
                  <li>• Educational environments</li>
                  <li>• Remote development teams</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
