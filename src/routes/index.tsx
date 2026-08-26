import { createFileRoute } from "@tanstack/react-router";
import { usePortfolio } from "@/lib/portfolio-store";
import { SectionRenderer } from "@/components/portfolio/sections";
import { Hero } from "@/components/portfolio/hero";
import { SiteNav } from "@/components/portfolio/site-nav";
import { AdminBar } from "@/components/portfolio/admin-bar";
import { ThemeVars } from "@/components/portfolio/theme-vars";
import { SiteFooter } from "@/components/portfolio/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Virgile Martinez — Senior Product Manager" },
      {
        name: "description",
        content:
          "Portfolio produit de Virgile Martinez, Senior Product Manager : études de cas, décisions clés et impact chiffré.",
      },
      { property: "og:title", content: "Virgile Martinez — Senior Product Manager" },
      {
        property: "og:description",
        content: "Études de cas produit, parcours et résultats chiffrés — de la discovery au scale.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <ThemeVars>
      <PortfolioBody />
    </ThemeVars>
  );
}

function PortfolioBody() {
  const { content } = usePortfolio();

  return (
    <div id="top" className="min-h-screen">
      <SiteNav />
      <main>
        <Hero />
        {content.sections.map((section, index) => (
          <SectionRenderer key={section.id} section={section} index={index} />
        ))}
      </main>
      <SiteFooter />
      <AdminBar />
      <div className="h-24" aria-hidden />
    </div>
  );
}
