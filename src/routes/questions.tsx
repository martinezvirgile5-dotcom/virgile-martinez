import { createFileRoute } from "@tanstack/react-router";
import { FaqSection } from "@/components/portfolio/faq";
import { SiteNav } from "@/components/portfolio/site-nav";
import { AdminBar } from "@/components/portfolio/admin-bar";
import { ThemeVars } from "@/components/portfolio/theme-vars";
import { SiteFooter } from "@/components/portfolio/site-footer";

export const Route = createFileRoute("/questions")({
  head: () => ({
    meta: [
      { title: "Questions & réponses — Virgile Martinez" },
      {
        name: "description",
        content: "Réponses de Virgile Martinez à quelques questions sur sa façon de faire du produit.",
      },
      { property: "og:title", content: "Questions & réponses — Virgile Martinez" },
      {
        property: "og:description",
        content: "Discovery, data, IA, produit : quelques questions fréquentes et leurs réponses.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/questions" },
    ],
    links: [{ rel: "canonical", href: "/questions" }],
  }),
  component: QuestionsPage,
});

function QuestionsPage() {
  return (
    <ThemeVars>
      <QuestionsBody />
    </ThemeVars>
  );
}

function QuestionsBody() {
  return (
    <div id="top" className="min-h-screen">
      <SiteNav />
      <main className="pt-24">
        <FaqSection />
      </main>
      <SiteFooter />
      <AdminBar />
      <div className="h-24" aria-hidden />
    </div>
  );
}
