import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Settings, User, Mail, Github, ShieldCheck } from "lucide-react";

export default async function SettingsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    return (
        <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-50 selection:bg-blue-500/30 font-sans">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 w-full h-96 bg-linear-to-b from-blue-500/10 to-transparent blur-3xl pointer-events-none z-0" />

            <main className="grow pt-28 pb-20 px-6 max-w-4xl mx-auto w-full relative z-10">
                {/* Header Section */}
                <div className="mb-12">
                    {/* Glowing Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(45,212,191,0.05)]">
                        <Settings className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
                            System // Configuration
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100 mb-2">
                        Account Settings
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Manage your profile details and integration preferences.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Profile Settings Card */}
                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl shadow-xl backdrop-blur-sm relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8 border-b border-slate-800/50 pb-6">
                            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-100">
                                    Profile Details
                                </h2>
                                <p className="text-sm text-slate-400 font-medium">
                                    Your personal information
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <User className="w-4 h-4 text-slate-500" />
                                    Display Name
                                </label>
                                {/* Styled like a sleek, read-only input field */}
                                <div className="w-full bg-slate-950/50 border border-slate-800 px-4 py-3.5 rounded-xl text-slate-200 font-medium shadow-inner">
                                    {session.user.name || "Anonymous Developer"}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <Mail className="w-4 h-4 text-slate-500" />
                                    Email Address
                                </label>
                                <div className="w-full bg-slate-950/50 border border-slate-800 px-4 py-3.5 rounded-xl text-slate-200 font-medium shadow-inner">
                                    {session.user.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* GitHub Integration Card */}
                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-colors duration-300">
                        {/* Visual Indicator of Connection */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                    <Github className="w-6 h-6 text-slate-100" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-100">
                                        GitHub Integration
                                    </h2>
                                    <p className="text-sm text-slate-400 font-medium">
                                        Repository access and sync
                                    </p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-mono shrink-0">
                                <ShieldCheck className="w-4 h-4" />
                                Connected via OAuth
                            </div>
                        </div>

                        <p className="text-slate-400 leading-relaxed mt-6 sm:pl-16">
                            Your account is securely linked to GitHub.
                            Repository cloning, committing, and syncing
                            permissions are handled automatically through your
                            active authentication session.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
