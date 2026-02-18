import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import FloatingIcons from "@/components/Animation/FloatingIcons";

export default function Home() {
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
          is a next-generation collaborative coding platform powered by AI.
          Write, debug, and ship faster with real-time teamwork, intelligent
          insights, and a seamless developer experience.
        </p>

        {/* CTA */}
        <Link href={"/dashboard"}>
          <Button
            size="lg"
            className="mt-12 text-lg px-10 py-7 rounded-xl bg-linear-to-r from-blue-400 via-teal-500 to-teal-600 hover:opacity-90 shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105"
          >
            Start Building Now
            <ArrowUpRight className="w-5 h-5 ml-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
