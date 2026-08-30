import type { Viewport, Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-providers";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { RepoSelectorProvider } from "@/features/github/components/repo-selector-provider";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins", // Added variable for Tailwind integration if needed
});

export const metadata: Metadata = {
    title: {
        default: "CodeStudio",
        template: "%s | CodeStudio",
    },
    description:
        "CodeStudio is an AI-powered collaborative code editor for modern developers. Write, debug, and build together with real-time teamwork and intelligent insights.",
    keywords: [
        "CodeStudio",
        "AI coding platform",
        "collaborative coding",
        "multi-agent AI",
    ],
    authors: [{ name: "CodeStudio Team" }],
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    openGraph: {
        title: "CodeStudio — Next-Generation Collaborative Coding Platform",
        description:
            "Next-generation collaborative coding platform powered by local AI.",
        url: "https://devtgthr.com",
        siteName: "CodeStudio",
        images: [
            {
                url: "/og.png",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "CodeStudio — Next-Generation Collaborative Coding Platform",
        description: "Build together. Code smarter.",
        images: ["/og.png"],
    },
    metadataBase: new URL("https://codestudio.eta.vercel.app"),
};

export const viewport: Viewport = {
    // Matches Tailwind's slate-950 perfectly for mobile browser headers
    themeColor: "#020617",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        // Added 'dark' class by default to prevent theme flickering before ThemeProvider loads
        <html lang="en" suppressHydrationWarning className="h-full dark">
            <body
                className={`${poppins.className} antialiased min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 flex flex-col`}
            >
                <SessionProvider session={session}>
                    <RepoSelectorProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem={false} // Forced to dark to maintain the specific aesthetic
                            disableTransitionOnChange
                        >
                            <div className="flex flex-col grow relative w-full overflow-x-hidden">
                                {/* Global Premium Toaster Styling */}
                                <Toaster
                                    richColors
                                    position="top-center"
                                    theme="dark"
                                    toastOptions={{
                                        className:
                                            "bg-slate-900/90 border border-slate-800 text-slate-100 backdrop-blur-md shadow-2xl rounded-xl",
                                        descriptionClassName: "text-slate-400",
                                    }}
                                />

                                <main className="flex-1 w-full flex flex-col">
                                    {children}
                                </main>
                            </div>
                        </ThemeProvider>
                    </RepoSelectorProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
