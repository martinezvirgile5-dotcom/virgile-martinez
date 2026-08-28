import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { usePortfolio } from "@/lib/portfolio-store";
import { t } from "@/lib/i18n";
import type { Section } from "@/lib/portfolio-content";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "CV — Virgile Martinez, Senior Product Manager" },
      {
        name: "description",
        content: "Version imprimable du CV de Virgile Martinez, Senior Product Manager : parcours, projets, résultats.",
      },
      { property: "og:title", content: "CV — Virgile Martinez, Senior Product Manager" },
      { property: "og:description", content: "CV imprimable : parcours, études de cas et résultats chiffrés." },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/cv" },
    ],
    links: [{ rel: "canonical", href: "/cv" }],
  }),
  component: CvPage,
});

function CvPage() {
  const { content, status, locale } = usePortfolio();
  const { hero } = content;

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  if (status === "loading") return <div className="p-10 text-sm text-muted-foreground">{t("loading", locale)}</div>;

  return (
    <div className="mx-auto max-w-3xl px-8 py-12 text-[13px] leading-relaxed">
      <div className="no-print mb-8 flex items-center justify-between gap-4">
        <Link to="/" className="link-underline text-xs text-muted-foreground">
          {t("backToPortfolio", locale)}
        </Link>
        <div className="flex gap-2">
          {hero.cvUrl && (
            <a
              href={hero.cvUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong px-4 py-2 text-xs font-medium"
            >
              {t("originalPdf", locale)}
            </a>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-medium text-brand-foreground"
          >
            <Printer className="size-3.5" />
            {t("downloadPdf", locale)}
          </button>
        </div>
      </div>

      <header className="border-b border-border pb-5">
        <h1 className="text-3xl font-semibold tracking-tight">
          {hero.firstName} {hero.lastName}
        </h1>
        <p className="mt-1 text-base text-brand">{hero.title}</p>
        <p className="mt-2 max-w-2xl text-muted-foreground">{hero.tagline}</p>
        <p className="mt-2 text-xs text-muted-foreground">{hero.availability}</p>
      </header>

      <div className="space-y-8 pt-6">
        {content.sections.filter((s) => s.visible).map((section) => (
          <CvSection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 border-b border-border pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </h2>
  );
}

function CvSection({ section }: { section: Section }) {
  switch (section.kind) {
    case "about":
      return (
        <section>
          <Heading>{section.title}</Heading>
          <p className="whitespace-pre-line text-muted-foreground">{section.body}</p>
        </section>
      );
    case "impact":
      return (
        <section>
          <Heading>{section.title}</Heading>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {section.items.map((m) => (
              <li key={m.id}>
                <p className="text-xl font-semibold text-brand">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </li>
            ))}
          </ul>
        </section>
      );
    case "experience":
      return (
        <section>
          <Heading>{section.title}</Heading>
          <div className="space-y-4">
            {section.items.map((item) => (
              <article key={item.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">
                    {item.role} · {item.company}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.period}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                </div>
                {item.summary?.trim() && (
                  <p className="mt-1 whitespace-pre-line text-muted-foreground">{item.summary}</p>
                )}
                <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                  {item.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
                {(item.positions ?? []).map((pos) => (
                  <div key={pos.id} className="mt-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium">{pos.role}</p>
                      <p className="text-xs text-muted-foreground">{pos.period}</p>
                    </div>
                    {pos.summary?.trim() && (
                      <p className="mt-1 whitespace-pre-line text-muted-foreground">{pos.summary}</p>
                    )}
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                      {pos.achievements.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>
      );
    case "projects":
      return (
        <section>
          <Heading>{section.title}</Heading>
          <div className="space-y-4">
            {section.items.map((p) => (
              <article key={p.id}>
                <p className="font-semibold">{p.name}</p>
                <p className="text-muted-foreground italic">{p.tagline}</p>
                <ul className="mt-1 space-y-0.5 text-muted-foreground">
                  <li>
                    <span className="font-medium text-foreground">Problème : </span>
                    {p.problem}
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Approche : </span>
                    {p.approach}
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Décisions : </span>
                    {p.decisions}
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Résultats : </span>
                    {p.results}
                  </li>
                </ul>
              </article>
            ))}
          </div>
        </section>
      );
    case "skills":
      return (
        <section>
          <Heading>{section.title}</Heading>
          <ul className="space-y-1">
            {section.groups.map((g) => (
              <li key={g.id}>
                <span className="font-medium">{g.name} : </span>
                <span className="text-muted-foreground">{g.items}</span>
              </li>
            ))}
          </ul>
        </section>
      );
    case "testimonials":
      return (
        <section>
          <Heading>{section.title}</Heading>
          <div className="space-y-3">
            {section.items.map((t) => (
              <blockquote key={t.id} className="border-l-2 border-border pl-3 text-muted-foreground">
                « {t.quote} » — <span className="text-foreground">{t.name}</span>, {t.role}
              </blockquote>
            ))}
          </div>
        </section>
      );
    case "education":
      return (
        <section>
          <Heading>{section.title}</Heading>
          <ul className="space-y-1">
            {section.items.map((e) => (
              <li key={e.id} className="flex flex-wrap justify-between gap-2">
                <span>
                  <span className="font-medium">{e.title}</span> — {e.org}
                </span>
                <span className="text-xs text-muted-foreground">{e.period}</span>
              </li>
            ))}
          </ul>
        </section>
      );
    case "contact":
      return (
        <section>
          <Heading>{section.title}</Heading>
          <p className="text-muted-foreground">{section.body}</p>
          <ul className="mt-2 space-y-0.5">
            {section.links
              .filter((l) => l.url)
              .map((l) => (
                <li key={l.id}>
                  <span className="font-medium">{l.label} : </span>
                  <a className="text-brand" href={l.url}>
                    {l.url.replace(/^mailto:/, "")}
                  </a>
                </li>
              ))}
          </ul>
        </section>
      );
    default:
      return null;
  }
}
