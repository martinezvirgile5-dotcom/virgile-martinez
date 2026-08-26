import { usePortfolio } from "@/lib/portfolio-store";
import { EditableText, ImageField, LinkEditor, Reveal } from "./editable";

export function Hero() {
  const { content, update, editMode } = usePortfolio();
  const hero = content.hero;

  return (
    <header className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full opacity-[0.14] blur-3xl"
        style={{ background: "var(--brand)" }}
      />
      <div className="relative mx-auto grid w-full max-w-5xl gap-12 px-6 pb-16 pt-28 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end md:pb-24 md:pt-40">
        <div className="space-y-7">
          <Reveal delay={60}>
            <h1 className="display-xl">
              <EditableText
                as="span"
                className="block"
                value={hero.firstName}
                onChange={(v) => update((d) => void (d.hero.firstName = v))}
              />
              <EditableText
                as="span"
                className="block text-brand"
                value={hero.lastName}
                onChange={(v) => update((d) => void (d.hero.lastName = v))}
              />
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <EditableText
              as="p"
              className="serif-accent text-2xl md:text-3xl"
              value={hero.title}
              onChange={(v) => update((d) => void (d.hero.title = v))}
            />
          </Reveal>
          <Reveal delay={180}>
            <EditableText
              as="p"
              multiline
              className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
              value={hero.tagline}
              onChange={(v) => update((d) => void (d.hero.tagline = v))}
            />
          </Reveal>
          <Reveal delay={240} className="space-y-3">
            <LinkEditor
              links={hero.ctas}
              render="cta"
              withVariant
              onChange={(ctas) => update((d) => void (d.hero.ctas = ctas))}
            />
            {editMode && (
              <label className="block text-xs text-muted-foreground">
                Lien vers votre CV PDF (optionnel)
                <input
                  className="mt-1 w-full max-w-md rounded-md border border-input bg-card px-2 py-1 text-xs text-foreground"
                  value={hero.cvUrl}
                  placeholder="https://…"
                  onChange={(e) => update((d) => void (d.hero.cvUrl = e.target.value))}
                />
              </label>
            )}
          </Reveal>
        </div>

        <Reveal delay={200}>
          <ImageField
            url={hero.portraitUrl}
            onChange={(v) => update((d) => void (d.hero.portraitUrl = v))}
            className="aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-card"
            alt={`${hero.firstName} ${hero.lastName}`}
            hint="Portrait (optionnel)"
          />
        </Reveal>
      </div>
    </header>
  );
}
