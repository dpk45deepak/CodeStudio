import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Agents",
    description:
        "Meet the local, zero-latency AI agents powering CodeStudio. From debugging to system architecture, discover your new virtual development team.",
};

export default function AgentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // The RootLayout already handles the background color and fonts,
    // so this layout simply wraps the page content.
    return <div className="w-full h-full">{children}</div>;
}
