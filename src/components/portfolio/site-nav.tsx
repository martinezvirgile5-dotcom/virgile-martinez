import { Link } from "@tanstack/react-router";
import { Download, HelpCircle, Languages, Moon, Sun } from "lucide-react";
import { usePortfolio } from "@/lib/portfolio-store";
import { slugify } from "@/lib/portfolio-content";
import { t } from "@/lib/i18n";

export function SiteNav() {
  const { content, mode, toggleMode, locale, toggleLocale } = usePortfolio();
  const navItems = content.sections.filter((s) => s.visible);

  return (
    <nav className="no-print fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-6 py-3">
        <Link to="/" className="text-sm font-medium tracking-tight">
          {content.hero.firstName} {content.hero.lastName}
        </Link>
        <ul className="ml-auto hidden items-center gap-5 lg:flex">
          {navItems.map((section) => (
            <li key={section.id}>
              <Link
                to="/"
                hash={slugify(section.label)}
                className="link-underline text-xs text-muted-foreground hover:text-foreground"
              >
                {section.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/questions"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent lg:ml-0"
        >
          <HelpCircle className="size-3.5" />
          Questions
        </Link>
        <Link
          to="/cv"
          className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
        >
          <Download className="size-3.5" />
          {t("cv", locale)}
        </Link>
        <button
          type="button"
          onClick={toggleLocale}
          aria-label={t("switchLanguage", locale)}
          className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Languages className="size-3.5" />
          {locale === "fr" ? "EN" : "FR"}
        </button>
        <button
          type="button"
          onClick={toggleMode}
          aria-label={mode === "dark" ? t("toLight", locale) : t("toDark", locale)}
          className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          {mode === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
        </button>
      </div>
    </nav>
  );
}
