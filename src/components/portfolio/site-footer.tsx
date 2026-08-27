import { Link } from "@tanstack/react-router";
import { usePortfolio } from "@/lib/portfolio-store";
import { t } from "@/lib/i18n";

export function SiteFooter() {
  const { content, isAdmin, locale } = usePortfolio();
  return (
    <footer className="hairline mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {content.hero.firstName} {content.hero.lastName} — {content.hero.title}
        </p>
        <div className="flex items-center gap-4">
          <Link to="/cv" className="link-underline">
            {t("printableCv", locale)}
          </Link>
          {!isAdmin && (
            <Link to="/auth" className="no-print link-underline">
              {t("editorSpace", locale)}
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
