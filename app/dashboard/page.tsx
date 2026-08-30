import React from "react";
import Image from "next/image";
import { FolderGit2 } from "lucide-react";
import AddNewButton from "@/features/dashboard/components/add-new-btn";
import AddRepo from "@/features/dashboard/components/add-repo";
import DashboardClient from "./components/dashboard-client";
import { getAllPlaygroundForUser } from "@/features/playground/actions";

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-sm shadow-xl relative overflow-hidden group">
        {/* Animated Top Border Glow */}
        <div className="absolute top-0 w-full h-1 bg-linear-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Icon / Image Container */}
        <div className="w-20 h-20 mb-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center relative">
            {/* Fallback to Lucide Icon if your SVG doesn't match the dark theme */}
            <FolderGit2 className="w-10 h-10 text-blue-400 absolute opacity-20" />
            <Image
                src="/empty-state.svg"
                alt="No projects"
                width={120}
                height={120}
                className="relative z-10 drop-shadow-lg"
                priority
            />
        </div>

        <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Workspace is Empty
        </h2>
        <p className="text-slate-400 max-w-sm text-center leading-relaxed">
            Initialize a new project or import an existing repository to start
            coding with your local AI agents.
        </p>
    </div>
);

export default async function DashboardMainPage() {
    const playgrounds = await getAllPlaygroundForUser();

    return (
        <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-50 selection:bg-blue-500/30 font-sans">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 w-full h-96 bg-linear-to-b from-blue-500/10 to-transparent blur-3xl pointer-events-none z-0" />

            <main className="grow pt-28 pb-20 px-6 max-w-7xl mx-auto w-full relative z-10">
                {/* Dashboard Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100 mb-2">
                        Your Workspace
                    </h1>
                    <p className="text-slate-400">
                        Manage your active environments, repositories, and local
                        deployments.
                    </p>
                </div>

                {/* Action Buttons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
                    <AddNewButton />
                    <AddRepo />
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col w-full">
                    {!playgrounds || playgrounds.length === 0 ? (
                        <div className="w-full max-w-2xl mx-auto">
                            <EmptyState />
                        </div>
                    ) : (
                        <div className="w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
                            <DashboardClient projects={playgrounds} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
