"use client"; // Required because we are using a hook (usePathname)

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    // Get the current URL path
    const pathname = usePathname();

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50 selection:bg-blue-500/30 font-sans overflow-hidden p-6">
            {/* Background Ambient Effects */}
            <div className="absolute top-0 w-full h-125 bg-linear-to-b from-blue-500/10 to-transparent blur-3xl pointer-events-none z-0" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                {/* Persistent Branding */}
                <Link
                    href="/"
                    className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity group"
                >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-shadow duration-300">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight text-slate-100">
                        Code<span className="text-blue-400">Studio</span>
                    </span>
                </Link>

                {/* Auth Card Drop Zone */}
                <main className="w-full">{children}</main>

                {/* DYNAMIC FOOTER ROUTING */}

                {/* Show this ONLY on the Sign In page */}
                {pathname === "/auth/sign-in" && (
                    <div className="mt-8 w-full pt-6 border-t border-slate-800/50 flex flex-col items-center">
                        <p className="text-sm text-slate-400 mb-4">
                            Don&apos;t have an account yet?
                        </p>
                        <Link href="/auth/sign-up" className="w-full">
                            <Button
                                variant="outline"
                                className="w-full group h-11 bg-slate-900/50 border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 hover:bg-blue-500/5 transition-all duration-300"
                            >
                                Create Account
                                <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Show this ONLY on the Sign Up page */}
                {pathname === "/auth/sign-up" && (
                    <div className="mt-8 w-full pt-6 border-t border-slate-800/50 flex flex-col items-center">
                        <p className="text-sm text-slate-400 mb-4">
                            Already have an account?
                        </p>
                        <Link href="/auth/sign-in" className="w-full">
                            <Button
                                variant="outline"
                                className="w-full group h-11 bg-slate-900/50 border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 hover:bg-blue-500/5 transition-all duration-300"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2 opacity-70 group-hover:-translate-x-1 group-hover:opacity-100 transition-all" />
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Subtle Footer */}
                <p className="mt-8 text-sm text-slate-500 font-medium">
                    Secure authentication via OAuth
                </p>
            </div>
        </div>
    );
};

export default AuthLayout;
