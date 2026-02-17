import Link from "next/link";
import { Github as LucideGithub } from "lucide-react";

export function Footer() {
  const socialLinks = [
    {
      href: "https://github.com",
      icon: LucideGithub,
    },
  ];

  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col items-center gap-6 text-center">

        {/* Social Icons */}
        <div className="flex gap-5">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link
                key={index}
                href={link.href}
                target="_blank"
                className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-all duration-300 border border-border hover:border-teal-400/40"
              >
                <Icon className="w-5 h-5 text-muted-foreground hover:text-teal-400 transition-colors" />
              </Link>
            );
          })}
        </div>

        {/* Brand Text */}
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-foreground">
            DevTgthr • SyntaxLab
          </span>
          . Built for developers, by developers.
        </p>
      </div>
    </footer>
  );
}
