import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/features/dashboard/dashboard-sidebar"
import { getAllPlaygroundForUser } from "@/features/playground/actions"
import type React from "react"

type PlaygroundItem = {
  id: string;
  title: string;
  template: string;
  Starmark?: {
    isMarked: boolean;
  }[];
};


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const playgroundData = await getAllPlaygroundForUser()

  // Store icon names (strings) instead of the components themselves
  const technologyIconMap: Record<string, string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
  }

const formattedPlaygroundData =
  playgroundData?.map((item: PlaygroundItem) => ({
    id: item.id,
    name: item.title,
    starred: item.Starmark?.[0]?.isMarked || false,
    icon: technologyIconMap[item.template] || "Code2",
  })) || [];


  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        {/* Pass the formatted data with string icon names */}
        <DashboardSidebar initialPlaygroundData={formattedPlaygroundData} />
        <main className="flex-1 bg-gray-950">{children}</main>
      </div>
    </SidebarProvider>
  )
}
