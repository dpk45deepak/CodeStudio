import type { Viewport } from "next";
import type { Metadata } from "next";
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
});

export const metadata: Metadata = {
  title: {
    default: "DevTgthr — SyntaxLab",
    template: "%s | DevTgthr",
  },

  description:
    "SyntaxLab is an AI-powered collaborative code editor for modern developers. Write, debug, and build together with real-time teamwork and intelligent insights.",

  keywords: [
    "DevTgthr",
    "SyntaxLab",
    "online code editor",
    "AI coding platform",
    "collaborative coding",
  ],

  authors: [{ name: "DevTgthr Team" }],

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "DevTgthr — SyntaxLab",
    description:
      "Next-generation collaborative coding platform powered by AI.",
    url: "https://devtgthr.com",
    siteName: "DevTgthr",
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
    title: "DevTgthr — SyntaxLab",
    description: "Build together. Code smarter.",
    images: ["/og.png"],
  },
  metadataBase: new URL("https://devtgthr.syntax-lab.vercel.app"),
};


export const viewport: Viewport = {
  themeColor: "#020617",
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${poppins.className} antialiased min-h-full`}>
        <SessionProvider session={session}>
          <RepoSelectorProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex flex-col min-h-screen">
                <Toaster richColors position="top-center" />
                <main className="flex-1">{children}</main>
              </div>
            </ThemeProvider>
          </RepoSelectorProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
