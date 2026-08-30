import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | DevTgthr",
    default: "Documentation | DevTgthr — SyntaxLab",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="relative z-10 w-full min-h-screen bg-background">
        {children}
      </main>

    </>
  );
}
