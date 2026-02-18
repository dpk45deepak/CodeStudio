"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight, Users, Rocket, Code2, HeartHandshake } from "lucide-react";
import Link from "next/link";
import FloatingIcons from "@/components/Animation/FloatingIcons";

export default function AboutUs() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start px-6 pt-20 overflow-hidden bg-background text-foreground">
      <FloatingIcons />

      {/* HERO SECTION */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-5xl">
        {/* BADGE */}
        <div className="flex items-center gap-2 text-sm font-semibold text-teal-300 bg-background border border-border px-5 py-2 rounded-full backdrop-blur-md shadow-lg">
          <Users className="w-4 h-4 text-teal-400" />
          DevTgthr • About Us
        </div>

        {/* HEADING */}
        <h1 className="mt-8 text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.15]">
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-teal-400 to-indigo-400">
            About DevTgthr
          </span>
        </h1>

        {/* DESCRIPTION */}
        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          DevTgthr SyntaxLab is a collaborative platform built for developers who
          believe in learning, building, and growing together. Our mission is to
          empower teams and individuals to ship better software faster through
          collaboration, knowledge sharing, and innovative tools.
        </p>
      </div>

      {/* FEATURES / VALUES */}
      <div className="relative z-20 grid md:grid-cols-3 gap-8 mt-20 max-w-6xl w-full">
        {[
          {
            icon: Code2,
            title: "Collaborative Coding",
            desc: "Work together in real-time, share ideas instantly, and build projects faster as a team.",
          },
          {
            icon: Rocket,
            title: "Innovation First",
            desc: "We focus on cutting-edge tools that help developers innovate and stay ahead.",
          },
          {
            icon: HeartHandshake,
            title: "Community Driven",
            desc: "A supportive developer community where everyone grows together.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-8 rounded-2xl bg-card/70 border border-border backdrop-blur-lg hover:border-teal-500/40 transition-all duration-300 hover:scale-105"
          >
            <item.icon className="w-10 h-10 text-teal-400 mb-5" />
            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link href="/dashboard">
        <Button
          size="lg"
          className="mt-20 mb-16 text-lg px-10 py-7 rounded-xl bg-
          linear-to-r from-blue-400 via-teal-500 to-teal-600 hover:opacity-90 shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105"
        >
          Join Our Community
          <ArrowUpRight className="w-5 h-5 ml-3" />
        </Button>
      </Link>
    </div>
  );
}
