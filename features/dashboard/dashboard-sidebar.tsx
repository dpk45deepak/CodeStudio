"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/sidebar"
import Image from "next/image"

// Define the interface for a single playground item, icon is now a string
interface PlaygroundData {
  id: string
  name: string
  icon: string // Changed to string
  starred: boolean
}

// Map icon names (strings) to their corresponding LucideIcon components and colors
const lucideIconMap: Record<string, { icon: LucideIcon; color: string }> = {
  Zap: { icon: Zap, color: "text-yellow-400" },
  Lightbulb: { icon: Lightbulb, color: "text-blue-400" },
  Database: { icon: Database, color: "text-green-400" },
  Compass: { icon: Compass, color: "text-purple-400" },
  FlameIcon: { icon: FlameIcon, color: "text-orange-400" },
  Terminal: { icon: Terminal, color: "text-cyan-400" },
  Code2: { icon: Code2, color: "text-gray-400" }, // Default icon
  // Add any other icons you might use dynamically
}

export function DashboardSidebar({ initialPlaygroundData }: { initialPlaygroundData: PlaygroundData[] }) {
  const pathname = usePathname()
  const [starredPlaygrounds, setStarredPlaygrounds] = useState(initialPlaygroundData.filter((p) => p.starred))
  const [recentPlaygrounds, setRecentPlaygrounds] = useState(initialPlaygroundData)

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-1 border-r bg-gray-950">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-3 justify-center">
          <Image src={"/dashboard.svg"} alt="logo" height={120} width={120} />
        </div>

      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"} tooltip="Home">
                <Link href="/" className="text-blue-300 hover:text-blue-200">
                  <Home className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300">Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard">
                <Link href="/dashboard" className="text-teal-300 hover:text-teal-200">
                  <LayoutDashboard className="h-4 w-4 text-teal-400" />
                  <span className="text-teal-300">Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          
          </SidebarMenu>
        </SidebarGroup>
        <div className="h-px bg-gray-800 mx-2 my-2"></div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-yellow-400">
            <Star className="h-4 w-4 mr-2 text-yellow-400" />
            Starred
          </SidebarGroupLabel>
          <SidebarGroupAction title="Add starred playground">
            <Plus className="h-4 w-4 text-yellow-300" />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>

              {starredPlaygrounds.length === 0 && recentPlaygrounds.length === 0 ? (
                <div className="text-center text-gray-500 py-4 w-full">Create your playground</div>
              ) : (
                starredPlaygrounds.map((playground) => {
                  const iconData = lucideIconMap[playground.icon] || { icon: Code2, color: "text-gray-400" };
                  const IconComponent = iconData.icon;
                  return (
                    <SidebarMenuItem key={playground.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/playground/${playground.id}`}
                        tooltip={playground.name}
                      >
                        <Link href={`/playground/${playground.id}`} className="text-yellow-200 hover:text-yellow-100">
                          {IconComponent && <IconComponent className={`h-4 w-4 ${iconData.color}`} />}
                          <span className="text-yellow-200">{playground.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="h-px bg-gray-800 mx-2 my-2"></div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-400">
            <History className="h-4 w-4 mr-2 text-blue-400" />
            Recent
          </SidebarGroupLabel>
          <SidebarGroupAction title="Create new playground">
            <FolderPlus className="h-4 w-4 text-blue-300" />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 && recentPlaygrounds.length === 0 ? null : (
                recentPlaygrounds.map((playground) => {
                  const iconData = lucideIconMap[playground.icon] || { icon: Code2, color: "text-gray-400" };
                  const IconComponent = iconData.icon;
                  return (
                    <SidebarMenuItem key={playground.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/playground/${playground.id}`}
                        tooltip={playground.name}
                      >
                        <Link href={`/playground/${playground.id}`} className="text-blue-200 hover:text-blue-100">
                          {IconComponent && <IconComponent className={`h-4 w-4 ${iconData.color}`} />}
                          <span className="text-blue-200">{playground.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View all">
                  <Link href="/playgrounds" className="text-gray-400 hover:text-gray-300">
                    <span className="text-sm text-gray-400">View all playgrounds</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="h-px bg-gray-800 mx-2 my-2"></div>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/settings" className="text-gray-400 hover:text-gray-300">
                <Settings className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
