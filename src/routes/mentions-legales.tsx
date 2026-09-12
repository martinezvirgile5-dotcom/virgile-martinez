import { createFileRoute, Link } from "@tanstack/react-router";
import { usePortfolio } from "@/lib/portfolio-store";
import { linkHref } from "@/lib/portfolio-content";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Virgile Martinez" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MentionsLegalesPage,
});

function MentionsLegalesPage() {
  const { content } = usePortfolio();
  const { hero } = content;
  const contactSection = content.sections.find((s) => s.kind === "contact");
  const emailLink = contactSection?.kind === "contact" ? contactSection.links.find((l) => l.label === "Email") : undefined;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed text-muted-foreground">
      <Link to="/" className="link-underline text-xs">
        ← Retour au portfolio
      </Link>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">Mentions légales</h1>

      <section className="mt-8 space-y-2">
        <h2 className="text-sm font-semibold text-foreground">Éditeur du site</h2>
        <p>
          {hero.firstName} {hero.lastName}
          {emailLink && (
            <>
              {" — "}
              <a className="link-underline text-brand" href={linkHref(emailLink.url)}>
                {emailLink.url.replace(/^mailto:/, "")}
              </a>
            </>
          )}
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-sm font-semibold text-foreground">Hébergement</h2>
        <p>Site hébergé via Lovable, base de données et authentification via Supabase.</p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-sm font-semibold text-foreground">Données & confidentialité</h2>
        <p>
          Ce site utilise un compteur de visites anonyme, sans cookie ni donnée personnelle : seule l'heure de chaque
          visite est enregistrée, à des fins de statistiques d'audience pour l'éditeur du site.
        </p>
      </section>
    </main>
  );
}
