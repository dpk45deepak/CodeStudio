
import  {Header}  from "@/features/home/header";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { auth } from "@/auth-edge";
// import { usePathname } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | DevTgthr",
    default: "DevTgthr — SyntaxLab",
  },
};

export default async function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    // const pathname = usePathname();

    return (
        <>
        {session ? (
            <Header />
        ) : (
            null
        )}

            <div
                className={cn(
                    "absolute inset-0 -z-10",
                    "bg-size-[40px_40px]",
                    "bg-[linear-gradient(to_right,rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.08)_1px,transparent_1px)]"
                )}
            />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-175 h-175 bg-linear-to-r from-blue-500/20 via-teal-400/20 to-indigo-500/20 blur-[140px] rounded-full" />
            </div>

            <main className="relative z-10 w-full min-h-screen bg-gray-950">
                {children}
            </main>

        </>
    );
}
