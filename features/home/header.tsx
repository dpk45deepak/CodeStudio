import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import UserButton from "../auth/components/user-button";

export function Header() {
  return (
    <div className="sticky top-0 z-50 w-full flex justify-center px-4 pt-4">
      <div
        className="
        flex items-center justify-between
        w-full max-w-6xl
        px-6 py-3
        rounded-2xl
        border border-border
        backdrop-blur-xl
        shadow-lg
        "
      >
        {/* LEFT: LOGO */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="https://img.icons8.com/?size=100&id=19294&format=png&color=000000" alt="Logo" width={40} height={40} />

            <span className="font-extrabold text-lg bg-gradient-to-r from-blue-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
              DevTgthr
            </span>
          </Link>
        </div>

        {/* CENTER NAV */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Build
          </Link>
          <Link
            href="/docs"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Docs
          </Link>

          <Link
            href="/about-us"
            className="text-muted-foreground hover:text-foreground transition flex items-center gap-2"
          >
            About Us
            <span className="text-xs px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-400/30 dark:bg-teal-400/20 dark:text-teal-400 dark:border-teal-300/30">
              New
            </span>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
}
