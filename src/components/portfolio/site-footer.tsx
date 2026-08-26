import { Link } from "@tanstack/react-router";
import { usePortfolio } from "@/lib/portfolio-store";

export function SiteFooter() {
  const { content, isAdmin } = usePortfolio();
  return (
    <footer className="hairline mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {content.hero.firstName} {content.hero.lastName} — {content.hero.title}
        </p>
        <div className="flex items-center gap-4">
          <Link to="/cv" className="link-underline">
            Version CV imprimable
          </Link>
          {!isAdmin && (
            <Link to="/auth" className="no-print link-underline">
              Espace d'édition
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
