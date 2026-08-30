"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Code2,
    Compass,
    FolderPlus,
    History,
    Home,
    LayoutDashboard,
    Lightbulb,
    type LucideIcon,
    Plus,
    Settings,
    Star,
    Terminal,
    Zap,
    Database,
    FlameIcon,
    Sparkles,
    GitBranch,
    Users,
    BookOpen,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarGroupAction,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";

// Define the interface for a single playground item, icon is now a string
interface PlaygroundData {
    id: string;
    name: string;
    icon: string; // Changed to string
    starred: boolean;
    lastOpened?: string;
    description?: string;
}

// Map icon names (strings) to their corresponding LucideIcon components and colors
const lucideIconMap: Record<string, { icon: LucideIcon; color: string }> = {
    Zap: { icon: Zap, color: "text-yellow-400" },
    Lightbulb: { icon: Lightbulb, color: "text-blue-400" },
    Database: { icon: Database, color: "text-green-400" },
    Compass: { icon: Compass, color: "text-purple-400" },
    FlameIcon: { icon: FlameIcon, color: "text-orange-400" },
    Terminal: { icon: Terminal, color: "text-cyan-400" },
    Code2: { icon: Code2, color: "text-slate-400" },
    Sparkles: { icon: Sparkles, color: "text-amber-400" },
    GitBranch: { icon: GitBranch, color: "text-rose-400" },
    Users: { icon: Users, color: "text-indigo-400" },
    BookOpen: { icon: BookOpen, color: "text-emerald-400" },
};

export function DashboardSidebar({
    initialPlaygroundData,
}: {
    initialPlaygroundData: PlaygroundData[];
}) {
    const pathname = usePathname();
    const [starredPlaygrounds] = useState(
        initialPlaygroundData.filter((p) => p.starred),
    );
    const [recentPlaygrounds] = useState(
        initialPlaygroundData,
    );
    const [isStarredExpanded, setIsStarredExpanded] = useState(true);
    const [isRecentExpanded, setIsRecentExpanded] = useState(true);

    return (
        <Sidebar
            variant="inset"
            collapsible="icon"
            className="border-r border-slate-800/50 bg-slate-950/95 backdrop-blur-sm"
        >
            {/* Ambient glow effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/5 blur-2xl rounded-full" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-500/5 blur-2xl rounded-full" />
            </div>

            <SidebarHeader className="relative border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 px-4 py-3 justify-center group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Image
                            src={"/dashboard.svg"}
                            alt="logo"
                            height={120}
                            width={120}
                            className="relative drop-shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.2)] transition-all duration-300"
                        />
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="relative">
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-mono text-slate-500 uppercase tracking-wider px-2">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === "/"}
                                tooltip="Home"
                                className="data-[active=true]:bg-blue-500/10 data-[active=true]:border data-[active=true]:border-blue-500/20 data-[active=true]:shadow-[0_0_15px_rgba(59,130,246,0.05)]"
                            >
                                <Link
                                    href="/"
                                    className="text-slate-300 hover:text-slate-100 group"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Home className="h-4 w-4 text-blue-400 relative" />
                                    </div>
                                    <span className="text-slate-300 group-hover:text-slate-100">
                                        Home
                                    </span>
                                    {pathname === "/" && (
                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === "/dashboard"}
                                tooltip="Dashboard"
                                className="data-[active=true]:bg-teal-500/10 data-[active=true]:border data-[active=true]:border-teal-500/20 data-[active=true]:shadow-[0_0_15px_rgba(20,184,166,0.05)]"
                            >
                                <Link
                                    href="/dashboard"
                                    className="text-slate-300 hover:text-slate-100 group"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-teal-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <LayoutDashboard className="h-4 w-4 text-teal-400 relative" />
                                    </div>
                                    <span className="text-slate-300 group-hover:text-slate-100">
                                        Dashboard
                                    </span>
                                    {pathname === "/dashboard" && (
                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === "/agents"}
                                tooltip="AI Agents"
                                className="data-[active=true]:bg-purple-500/10 data-[active=true]:border data-[active=true]:border-purple-500/20 data-[active=true]:shadow-[0_0_15px_rgba(168,85,247,0.05)]"
                            >
                                <Link
                                    href="/agents"
                                    className="text-slate-300 hover:text-slate-100 group"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Sparkles className="h-4 w-4 text-purple-400 relative" />
                                    </div>
                                    <span className="text-slate-300 group-hover:text-slate-100">
                                        AI Agents
                                    </span>
                                    {pathname === "/agents" && (
                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mx-2 my-2" />

                {/* Starred Playgrounds */}
                <SidebarGroup>
                    <div className="flex items-center justify-between">
                        <SidebarGroupLabel
                            className="text-[10px] font-mono text-yellow-400 uppercase tracking-wider cursor-pointer hover:text-yellow-300 transition-colors px-2"
                            onClick={() =>
                                setIsStarredExpanded(!isStarredExpanded)
                            }
                        >
                            <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 mr-1 text-yellow-400" />
                                Starred
                                {isStarredExpanded ? (
                                    <ChevronDown className="h-3 w-3 ml-1 text-yellow-400/60" />
                                ) : (
                                    <ChevronRight className="h-3 w-3 ml-1 text-yellow-400/60" />
                                )}
                            </div>
                        </SidebarGroupLabel>
                        <SidebarGroupAction
                            title="Add starred playground"
                            className="text-yellow-400/60 hover:text-yellow-400 hover:bg-yellow-400/10"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </SidebarGroupAction>
                    </div>

                    {isStarredExpanded && (
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {starredPlaygrounds.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-6 px-2">
                                        <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2">
                                            <Star className="h-4 w-4 text-yellow-400/40" />
                                        </div>
                                        <p className="text-xs text-slate-500 text-center">
                                            No starred playgrounds
                                        </p>
                                        <p className="text-[10px] text-slate-600 text-center mt-0.5">
                                            Star your favorites
                                        </p>
                                    </div>
                                ) : (
                                    starredPlaygrounds.map((playground) => {
                                        const iconData = lucideIconMap[
                                            playground.icon
                                        ] || {
                                            icon: Code2,
                                            color: "text-slate-400",
                                        };
                                        const IconComponent = iconData.icon;
                                        const isActive =
                                            pathname ===
                                            `/playground/${playground.id}`;
                                        return (
                                            <SidebarMenuItem
                                                key={playground.id}
                                            >
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={isActive}
                                                    tooltip={playground.name}
                                                    className="data-[active=true]:bg-yellow-500/10 data-[active=true]:border data-[active=true]:border-yellow-500/20 data-[active=true]:shadow-[0_0_15px_rgba(234,179,8,0.05)] group"
                                                >
                                                    <Link
                                                        href={`/playground/${playground.id}`}
                                                        className="text-slate-300 hover:text-slate-100 group"
                                                    >
                                                        <div className="relative">
                                                            <div className="absolute inset-0 bg-yellow-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            {IconComponent && (
                                                                <IconComponent
                                                                    className={`h-4 w-4 ${iconData.color} relative`}
                                                                />
                                                            )}
                                                        </div>
                                                        <span className="text-slate-300 group-hover:text-slate-100 truncate">
                                                            {playground.name}
                                                        </span>
                                                        {isActive && (
                                                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                                                        )}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    )}
                </SidebarGroup>

                <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mx-2 my-2" />

                {/* Recent Playgrounds */}
                <SidebarGroup>
                    <div className="flex items-center justify-between">
                        <SidebarGroupLabel
                            className="text-[10px] font-mono text-blue-400 uppercase tracking-wider cursor-pointer hover:text-blue-300 transition-colors px-2"
                            onClick={() =>
                                setIsRecentExpanded(!isRecentExpanded)
                            }
                        >
                            <div className="flex items-center gap-1">
                                <History className="h-3 w-3 mr-1 text-blue-400" />
                                Recent
                                {isRecentExpanded ? (
                                    <ChevronDown className="h-3 w-3 ml-1 text-blue-400/60" />
                                ) : (
                                    <ChevronRight className="h-3 w-3 ml-1 text-blue-400/60" />
                                )}
                            </div>
                        </SidebarGroupLabel>
                        <SidebarGroupAction
                            title="Create new playground"
                            className="text-blue-400/60 hover:text-blue-400 hover:bg-blue-400/10"
                        >
                            <FolderPlus className="h-3.5 w-3.5" />
                        </SidebarGroupAction>
                    </div>

                    {isRecentExpanded && (
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {recentPlaygrounds.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-6 px-2">
                                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                                            <FolderPlus className="h-4 w-4 text-blue-400/40" />
                                        </div>
                                        <p className="text-xs text-slate-500 text-center">
                                            No recent playgrounds
                                        </p>
                                        <p className="text-[10px] text-slate-600 text-center mt-0.5">
                                            Create your first one
                                        </p>
                                    </div>
                                ) : (
                                    recentPlaygrounds.map((playground) => {
                                        const iconData = lucideIconMap[
                                            playground.icon
                                        ] || {
                                            icon: Code2,
                                            color: "text-slate-400",
                                        };
                                        const IconComponent = iconData.icon;
                                        const isActive =
                                            pathname ===
                                            `/playground/${playground.id}`;
                                        return (
                                            <SidebarMenuItem
                                                key={playground.id}
                                            >
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={isActive}
                                                    tooltip={playground.name}
                                                    className="data-[active=true]:bg-blue-500/10 data-[active=true]:border data-[active=true]:border-blue-500/20 data-[active=true]:shadow-[0_0_15px_rgba(59,130,246,0.05)] group"
                                                >
                                                    <Link
                                                        href={`/playground/${playground.id}`}
                                                        className="text-slate-300 hover:text-slate-100 group"
                                                    >
                                                        <div className="relative">
                                                            <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            {IconComponent && (
                                                                <IconComponent
                                                                    className={`h-4 w-4 ${iconData.color} relative`}
                                                                />
                                                            )}
                                                        </div>
                                                        <span className="text-slate-300 group-hover:text-slate-100 truncate">
                                                            {playground.name}
                                                        </span>
                                                        {playground.lastOpened && (
                                                            <span className="text-[10px] text-slate-500 ml-auto">
                                                                {new Date(
                                                                    playground.lastOpened,
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                        {isActive && (
                                                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                                        )}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })
                                )}

                                {recentPlaygrounds.length > 0 && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip="View all"
                                            className="hover:bg-slate-800/50 group"
                                        >
                                            <Link
                                                href="/playgrounds"
                                                className="text-slate-500 hover:text-slate-400"
                                            >
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-slate-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <span className="text-[11px] font-mono text-slate-500 group-hover:text-slate-400 relative">
                                                        View all playgrounds →
                                                    </span>
                                                </div>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    )}
                </SidebarGroup>
            </SidebarContent>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mx-2 my-2" />

            <SidebarFooter className="relative border-t border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip="Settings"
                            className="hover:bg-slate-800/50 group data-[active=true]:bg-slate-800/50"
                        >
                            <Link
                                href="/settings"
                                className="text-slate-400 hover:text-slate-300 group"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-slate-400/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Settings className="h-4 w-4 text-slate-400 group-hover:text-slate-300 relative" />
                                </div>
                                <span className="text-slate-400 group-hover:text-slate-300">
                                    Settings
                                </span>
                                {pathname === "/settings" && (
                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.5)]" />
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail className="bg-slate-800/30 hover:bg-slate-800/50 transition-colors" />
        </Sidebar>
    );
}
