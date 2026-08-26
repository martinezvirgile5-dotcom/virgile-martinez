import { Link } from "@tanstack/react-router";
import { Download, Moon, Sun } from "lucide-react";
import { usePortfolio } from "@/lib/portfolio-store";
import { slugify } from "@/lib/portfolio-content";

export function SiteNav() {
  const { content, mode, toggleMode } = usePortfolio();
  const items = content.sections.filter((s) => s.visible);

  return (
    <nav className="no-print fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-6 py-3">
        <a href="#top" className="text-sm font-medium tracking-tight">
          {content.hero.firstName} {content.hero.lastName}
        </a>
        <ul className="ml-auto hidden items-center gap-5 lg:flex">
          {items.map((section) => (
            <li key={section.id}>
              <a
                href={`#${slugify(section.label)}`}
                className="link-underline text-xs text-muted-foreground hover:text-foreground"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
        <Link
          to="/cv"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent lg:ml-0"
        >
          <Download className="size-3.5" />
          CV
        </Link>
        <button
          type="button"
          onClick={toggleMode}
          aria-label={mode === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
          className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          {mode === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
        </button>
      </div>
    </nav>
  );
}
