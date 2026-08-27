import { Eye, EyeOff } from "lucide-react";
import { usePortfolio } from "@/lib/portfolio-store";
import {
  emptyExperience,
  emptyPosition,
  emptyProject,
  slugify,
  uid,
  type Education,
  type Experience,
  type Metric,
  type PortfolioContent,
  type Position,
  type Project,
  type Section,
  type SkillGroup,
  type Testimonial,
} from "@/lib/portfolio-content";
import { cn } from "@/lib/utils";
import { EditableText, ImageField, ItemToolbar, LinkEditor, Reveal, move } from "./editable";

function useSection<T extends Section>(index: number) {
  const { update } = usePortfolio();
  return (recipe: (section: T) => void) =>
    update((draft: PortfolioContent) => {
      recipe(draft.sections[index] as T);
    });
}

function SectionShell({
  section,
  index,
  children,
  className,
}: {
  section: Section;
  index: number;
  children: React.ReactNode;
  className?: string;
}) {
  const { editMode, update } = usePortfolio();
  const patch = useSection(index);

  if (!section.visible && !editMode) return null;

  return (
    <section
      id={slugify(section.label)}
      className={cn(
        "mx-auto w-full max-w-5xl px-6 py-20 md:py-28",
        !section.visible && "opacity-45",
        className,
      )}
    >
      {editMode && (
        <div className="no-print mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border-strong/60 bg-card/60 px-3 py-2">
          <span className="eyebrow">Bloc</span>
          <input
            className="w-40 rounded-md border border-input bg-card px-2 py-1 text-xs"
            value={section.label}
            onChange={(e) => patch((s) => void (s.label = e.target.value))}
          />
          <ItemToolbar
            onUp={index > 0 ? () => update((d) => void (d.sections = move(d.sections, index, -1))) : undefined}
            onDown={() => update((d) => void (d.sections = move(d.sections, index, 1)))}
            onDelete={() => update((d) => void (d.sections = d.sections.filter((_, i) => i !== index)))}
          />
          <button
            type="button"
            className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground"
            onClick={() => patch((s) => void (s.visible = !s.visible))}
          >
            {section.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            {section.visible ? "Visible" : "Masqué"}
          </button>
        </div>
      )}
      {children}
    </section>
  );
}

function SectionHeading({ section, index }: { section: Section; index: number }) {
  const patch = useSection(index);
  return (
    <Reveal className="mb-10 flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <span className="eyebrow">{section.label}</span>
      <EditableText
        as="h2"
        className="display-md flex-1 basis-full"
        value={section.title}
        onChange={(v) => patch((s) => void (s.title = v))}
      />
    </Reveal>
  );
}

const addBtn =
  "no-print mt-8 inline-flex items-center gap-2 rounded-full border border-dashed border-border-strong px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground";

/* ---------------------------------- about --------------------------------- */

function AboutSection({ section, index }: { section: Extract<Section, { kind: "about" }>; index: number }) {
  const patch = useSection<typeof section>(index);
  return (
    <SectionShell section={section} index={index}>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <Reveal>
          <span className="eyebrow">{section.label}</span>
          <EditableText
            as="h2"
            className="display-md mt-3"
            value={section.title}
            onChange={(v) => patch((s) => void (s.title = v))}
          />
        </Reveal>
        <Reveal delay={80}>
          <EditableText
            as="p"
            multiline
            className="text-lg leading-relaxed text-muted-foreground md:text-xl"
            value={section.body}
            onChange={(v) => patch((s) => void (s.body = v))}
          />
        </Reveal>
      </div>
    </SectionShell>
  );
}

/* --------------------------------- impact --------------------------------- */

function ImpactSection({ section, index }: { section: Extract<Section, { kind: "impact" }>; index: number }) {
  const patch = useSection<typeof section>(index);
  const setItems = (fn: (items: Metric[]) => Metric[]) => patch((s) => void (s.items = fn(s.items)));
  return (
    <SectionShell section={section} index={index}>
      <SectionHeading section={section} index={index} />
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {section.items.map((metric, i) => (
          <Reveal key={metric.id} delay={i * 70} className="bg-card">
            <div className="flex h-full flex-col gap-3 p-6">
              <EditableText
                as="p"
                className="metric-value"
                value={metric.value}
                onChange={(v) => setItems((items) => items.map((m) => (m.id === metric.id ? { ...m, value: v } : m)))}
              />
              <EditableText
                as="p"
                multiline
                className="text-sm leading-snug text-muted-foreground"
                value={metric.label}
                onChange={(v) => setItems((items) => items.map((m) => (m.id === metric.id ? { ...m, label: v } : m)))}
              />
              <ItemToolbar
                className="mt-auto pt-3"
                onUp={i > 0 ? () => setItems((items) => move(items, i, -1)) : undefined}
                onDown={() => setItems((items) => move(items, i, 1))}
                onDuplicate={() => setItems((items) => [...items, { ...metric, id: uid() }])}
                onDelete={() => setItems((items) => items.filter((m) => m.id !== metric.id))}
              />
            </div>
          </Reveal>
        ))}
      </div>
      <EditModeOnly>
        <button
          type="button"
          className={addBtn}
          onClick={() => setItems((items) => [...items, { id: uid(), value: "+00%", label: "métrique" }])}
        >
          + Ajouter un chiffre
        </button>
      </EditModeOnly>
    </SectionShell>
  );
}

function EditModeOnly({ children }: { children: React.ReactNode }) {
  const { editMode } = usePortfolio();
  if (!editMode) return null;
  return <>{children}</>;
}

/* ------------------------------- experience ------------------------------- */

function ExperienceSection({ section, index }: { section: Extract<Section, { kind: "experience" }>; index: number }) {
  const patch = useSection<typeof section>(index);
  const setItems = (fn: (items: Experience[]) => Experience[]) => patch((s) => void (s.items = fn(s.items)));
  const patchItem = (id: string, next: Partial<Experience>) =>
    setItems((items) => items.map((it) => (it.id === id ? { ...it, ...next } : it)));

  return (
    <SectionShell section={section} index={index}>
      <SectionHeading section={section} index={index} />
      <ol className="space-y-px overflow-hidden rounded-2xl border border-border bg-border">
        {section.items.map((item, i) => (
          <li key={item.id} className="bg-card">
            <Reveal delay={i * 60}>
              <article className="grid gap-6 p-6 md:grid-cols-[13rem_minmax(0,1fr)] md:p-8">
                <div className="space-y-3">
                  <ImageField
                    url={item.logoUrl}
                    onChange={(v) => patchItem(item.id, { logoUrl: v })}
                    className="h-9 w-24 overflow-hidden"
                    imgClassName="object-contain object-left"
                    alt={`Logo ${item.company}`}
                    hint="Logo"
                  />
                  <EditableText
                    as="p"
                    className="font-mono text-xs tracking-wide text-muted-foreground"
                    value={item.period}
                    onChange={(v) => patchItem(item.id, { period: v })}
                  />
                  <EditableText
                    as="p"
                    className="text-xs text-muted-foreground"
                    value={item.location ?? ""}
                    onChange={(v) => patchItem(item.id, { location: v })}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <EditableText
                      as="h3"
                      className="text-xl font-medium tracking-tight"
                      value={item.company}
                      onChange={(v) => patchItem(item.id, { company: v })}
                    />
                    <EditableText
                      as="p"
                      className="text-sm text-brand"
                      value={item.role}
                      onChange={(v) => patchItem(item.id, { role: v })}
                    />
                  </div>
                  <ul className="space-y-2">
                    {item.achievements.map((line, li) => (
                      <li key={li} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                        <EditableText
                          multiline
                          className="flex-1"
                          value={line}
                          onChange={(v) =>
                            patchItem(item.id, {
                              achievements: item.achievements.map((a, ai) => (ai === li ? v : a)),
                            })
                          }
                        />
                        <EditModeOnly>
                          <button
                            type="button"
                            className="text-xs text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              patchItem(item.id, {
                                achievements: item.achievements.filter((_, ai) => ai !== li),
                              })
                            }
                          >
                            ✕
                          </button>
                        </EditModeOnly>
                      </li>
                    ))}
                  </ul>
                  <EditModeOnly>
                    <button
                      type="button"
                      className="text-xs font-medium text-brand hover:underline"
                      onClick={() =>
                        patchItem(item.id, {
                          achievements: [...item.achievements, "Nouvelle réalisation avec une métrique."],
                        })
                      }
                    >
                      + Ajouter une réalisation
                    </button>
                  </EditModeOnly>

                  {(item.positions ?? []).map((pos) => {
                    const positions = item.positions ?? [];
                    const patchPos = (next: Partial<Position>) =>
                      patchItem(item.id, {
                        positions: positions.map((p) => (p.id === pos.id ? { ...p, ...next } : p)),
                      });
                    return (
                      <div key={pos.id} className="space-y-3 pt-4">
                        <div>
                          <EditableText
                            as="p"
                            className="text-sm text-brand"
                            value={pos.role}
                            onChange={(v) => patchPos({ role: v })}
                          />
                          <EditableText
                            as="p"
                            className="font-mono text-xs tracking-wide text-muted-foreground"
                            value={pos.period}
                            onChange={(v) => patchPos({ period: v })}
                          />
                        </div>
                        <ul className="space-y-2">
                          {pos.achievements.map((line, li) => (
                            <li key={li} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-border" aria-hidden />
                              <EditableText
                                multiline
                                className="flex-1"
                                value={line}
                                onChange={(v) =>
                                  patchPos({ achievements: pos.achievements.map((a, ai) => (ai === li ? v : a)) })
                                }
                              />
                              <EditModeOnly>
                                <button
                                  type="button"
                                  className="text-xs text-muted-foreground hover:text-destructive"
                                  onClick={() =>
                                    patchPos({ achievements: pos.achievements.filter((_, ai) => ai !== li) })
                                  }
                                >
                                  ✕
                                </button>
                              </EditModeOnly>
                            </li>
                          ))}
                        </ul>
                        <EditModeOnly>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              className="text-xs font-medium text-brand hover:underline"
                              onClick={() =>
                                patchPos({
                                  achievements: [...pos.achievements, "Nouvelle réalisation avec une métrique."],
                                })
                              }
                            >
                              + Ajouter une réalisation
                            </button>
                            <button
                              type="button"
                              className="text-xs text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                patchItem(item.id, { positions: positions.filter((p) => p.id !== pos.id) })
                              }
                            >
                              Supprimer ce poste
                            </button>
                          </div>
                        </EditModeOnly>
                      </div>
                    );
                  })}

                  <EditModeOnly>
                    <button
                      type="button"
                      className="text-xs font-medium text-brand hover:underline"
                      onClick={() =>
                        patchItem(item.id, { positions: [...(item.positions ?? []), emptyPosition()] })
                      }
                    >
                      + Ajouter un poste dans cette entreprise
                    </button>
                  </EditModeOnly>
                  <LinkEditor links={item.links} onChange={(links) => patchItem(item.id, { links })} />

                  <ItemToolbar
                    onUp={i > 0 ? () => setItems((items) => move(items, i, -1)) : undefined}
                    onDown={() => setItems((items) => move(items, i, 1))}
                    onDuplicate={() => setItems((items) => [...items, { ...item, id: uid() }])}
                    onDelete={() => setItems((items) => items.filter((it) => it.id !== item.id))}
                  />
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
      <EditModeOnly>
        <button type="button" className={addBtn} onClick={() => setItems((items) => [...items, emptyExperience()])}>
          + Ajouter une expérience
        </button>
      </EditModeOnly>
    </SectionShell>
  );
}

/* -------------------------------- projects -------------------------------- */

const projectBlocks: { key: keyof Pick<Project, "problem" | "approach" | "decisions" | "results">; label: string }[] = [
  { key: "problem", label: "Problème" },
  { key: "approach", label: "Approche" },
  { key: "decisions", label: "Décisions clés" },
  { key: "results", label: "Résultats" },
];

function ProjectsSection({ section, index }: { section: Extract<Section, { kind: "projects" }>; index: number }) {
  const patch = useSection<typeof section>(index);
  const setItems = (fn: (items: Project[]) => Project[]) => patch((s) => void (s.items = fn(s.items)));
  const patchItem = (id: string, next: Partial<Project>) =>
    setItems((items) => items.map((it) => (it.id === id ? { ...it, ...next } : it)));

  return (
    <SectionShell section={section} index={index}>
      <SectionHeading section={section} index={index} />
      <div className="space-y-8">
        {section.items.map((item, i) => (
          <Reveal key={item.id} delay={i * 60}>
            <article className="surface-card surface-card-hover overflow-hidden">
              <ImageField
                url={item.imageUrl}
                onChange={(v) => patchItem(item.id, { imageUrl: v })}
                className="aspect-[16/7] w-full overflow-hidden border-b border-border bg-muted"
                alt={item.name}
                hint="Maquette, dashboard ou schéma"
              />
              <div className="space-y-8 p-6 md:p-10">
                <header className="space-y-2">
                  <EditableText
                    as="h3"
                    className="text-2xl font-medium tracking-tight md:text-3xl"
                    value={item.name}
                    onChange={(v) => patchItem(item.id, { name: v })}
                  />
                  <EditableText
                    as="p"
                    multiline
                    className="serif-accent text-lg text-muted-foreground md:text-xl"
                    value={item.tagline}
                    onChange={(v) => patchItem(item.id, { tagline: v })}
                  />
                </header>
                <div className="grid gap-6 sm:grid-cols-2">
                  {projectBlocks.map((block) => (
                    <div key={block.key} className="space-y-2 border-l-2 border-brand/30 pl-4">
                      <p className="eyebrow">{block.label}</p>
                      <EditableText
                        as="p"
                        multiline
                        className="text-sm leading-relaxed text-muted-foreground"
                        value={item[block.key]}
                        onChange={(v) => patchItem(item.id, { [block.key]: v } as Partial<Project>)}
                      />
                    </div>
                  ))}
                </div>
                <LinkEditor links={item.links} onChange={(links) => patchItem(item.id, { links })} />
                <ItemToolbar
                  onUp={i > 0 ? () => setItems((items) => move(items, i, -1)) : undefined}
                  onDown={() => setItems((items) => move(items, i, 1))}
                  onDuplicate={() => setItems((items) => [...items, { ...item, id: uid() }])}
                  onDelete={() => setItems((items) => items.filter((it) => it.id !== item.id))}
                />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <EditModeOnly>
        <button type="button" className={addBtn} onClick={() => setItems((items) => [...items, emptyProject()])}>
          + Ajouter une étude de cas
        </button>
      </EditModeOnly>
    </SectionShell>
  );
}

/* --------------------------------- skills --------------------------------- */

function SkillsSection({ section, index }: { section: Extract<Section, { kind: "skills" }>; index: number }) {
  const { editMode } = usePortfolio();
  const patch = useSection<typeof section>(index);
  const setGroups = (fn: (groups: SkillGroup[]) => SkillGroup[]) => patch((s) => void (s.groups = fn(s.groups)));

  return (
    <SectionShell section={section} index={index}>
      <SectionHeading section={section} index={index} />
      <div className="grid gap-6 sm:grid-cols-2">
        {section.groups.map((group, i) => (
          <Reveal key={group.id} delay={i * 60}>
            <div className="surface-card surface-card-hover h-full space-y-4 p-6">
              <EditableText
                as="h3"
                className="text-sm font-semibold uppercase tracking-[0.12em]"
                value={group.name}
                onChange={(v) => setGroups((gs) => gs.map((g) => (g.id === group.id ? { ...g, name: v } : g)))}
              />
              {editMode ? (
                <EditableText
                  multiline
                  className="w-full text-sm text-muted-foreground"
                  value={group.items}
                  onChange={(v) => setGroups((gs) => gs.map((g) => (g.id === group.id ? { ...g, items: v } : g)))}
                />
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {group.items
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((skill) => (
                      <li
                        key={skill}
                        className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
                      >
                        {skill}
                      </li>
                    ))}
                </ul>
              )}
              <ItemToolbar
                onUp={i > 0 ? () => setGroups((gs) => move(gs, i, -1)) : undefined}
                onDown={() => setGroups((gs) => move(gs, i, 1))}
                onDuplicate={() => setGroups((gs) => [...gs, { ...group, id: uid() }])}
                onDelete={() => setGroups((gs) => gs.filter((g) => g.id !== group.id))}
              />
            </div>
          </Reveal>
        ))}
      </div>
      <EditModeOnly>
        <button
          type="button"
          className={addBtn}
          onClick={() => setGroups((gs) => [...gs, { id: uid(), name: "Catégorie", items: "compétence, compétence" }])}
        >
          + Ajouter une catégorie
        </button>
      </EditModeOnly>
    </SectionShell>
  );
}

/* ------------------------------ testimonials ------------------------------ */

function TestimonialsSection({
  section,
  index,
}: {
  section: Extract<Section, { kind: "testimonials" }>;
  index: number;
}) {
  const patch = useSection<typeof section>(index);
  const setItems = (fn: (items: Testimonial[]) => Testimonial[]) => patch((s) => void (s.items = fn(s.items)));
  const patchItem = (id: string, next: Partial<Testimonial>) =>
    setItems((items) => items.map((it) => (it.id === id ? { ...it, ...next } : it)));

  return (
    <SectionShell section={section} index={index}>
      <SectionHeading section={section} index={index} />
      <div className="grid gap-6 md:grid-cols-2">
        {section.items.map((item, i) => (
          <Reveal key={item.id} delay={i * 70}>
            <figure className="surface-card surface-card-hover h-full space-y-5 p-6 md:p-8">
              <EditableText
                as="blockquote"
                multiline
                className="serif-accent text-xl leading-snug md:text-2xl"
                value={item.quote}
                onChange={(v) => patchItem(item.id, { quote: v })}
              />
              <figcaption className="space-y-0.5">
                <EditableText
                  as="p"
                  className="text-sm font-medium"
                  value={item.name}
                  onChange={(v) => patchItem(item.id, { name: v })}
                />
                <EditableText
                  as="p"
                  className="text-xs text-muted-foreground"
                  value={item.role}
                  onChange={(v) => patchItem(item.id, { role: v })}
                />
              </figcaption>
              <ItemToolbar
                onUp={i > 0 ? () => setItems((items) => move(items, i, -1)) : undefined}
                onDown={() => setItems((items) => move(items, i, 1))}
                onDuplicate={() => setItems((items) => [...items, { ...item, id: uid() }])}
                onDelete={() => setItems((items) => items.filter((it) => it.id !== item.id))}
              />
            </figure>
          </Reveal>
        ))}
      </div>
      <EditModeOnly>
        <button
          type="button"
          className={addBtn}
          onClick={() =>
            setItems((items) => [
              ...items,
              { id: uid(), quote: "Citation courte.", name: "Prénom Nom", role: "Fonction" },
            ])
          }
        >
          + Ajouter une recommandation
        </button>
      </EditModeOnly>
    </SectionShell>
  );
}

/* -------------------------------- education ------------------------------- */

function EducationSection({ section, index }: { section: Extract<Section, { kind: "education" }>; index: number }) {
  const patch = useSection<typeof section>(index);
  const setItems = (fn: (items: Education[]) => Education[]) => patch((s) => void (s.items = fn(s.items)));
  const patchItem = (id: string, next: Partial<Education>) =>
    setItems((items) => items.map((it) => (it.id === id ? { ...it, ...next } : it)));

  return (
    <SectionShell section={section} index={index}>
      <SectionHeading section={section} index={index} />
      <ul className="divide-y divide-border">
        {section.items.map((item, i) => (
          <li key={item.id} className="py-5">
            <Reveal delay={i * 50}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <div className="min-w-0 flex-1 space-y-1">
                  <EditableText
                    as="p"
                    className="text-base font-medium"
                    value={item.title}
                    onChange={(v) => patchItem(item.id, { title: v })}
                  />
                  <EditableText
                    as="p"
                    className="text-sm text-muted-foreground"
                    value={item.org}
                    onChange={(v) => patchItem(item.id, { org: v })}
                  />
                  <LinkEditor links={item.links} onChange={(links) => patchItem(item.id, { links })} />
                </div>
                <EditableText
                  as="p"
                  className="font-mono text-xs text-muted-foreground"
                  value={item.period}
                  onChange={(v) => patchItem(item.id, { period: v })}
                />
                <ItemToolbar
                  onUp={i > 0 ? () => setItems((items) => move(items, i, -1)) : undefined}
                  onDown={() => setItems((items) => move(items, i, 1))}
                  onDuplicate={() => setItems((items) => [...items, { ...item, id: uid() }])}
                  onDelete={() => setItems((items) => items.filter((it) => it.id !== item.id))}
                />
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
      <EditModeOnly>
        <button
          type="button"
          className={addBtn}
          onClick={() =>
            setItems((items) => [...items, { id: uid(), title: "Diplôme", org: "École", period: "20XX", links: [] }])
          }
        >
          + Ajouter une formation
        </button>
      </EditModeOnly>
    </SectionShell>
  );
}

/* --------------------------------- contact -------------------------------- */

function ContactSection({ section, index }: { section: Extract<Section, { kind: "contact" }>; index: number }) {
  const patch = useSection<typeof section>(index);
  return (
    <SectionShell section={section} index={index} className="max-w-5xl">
      <Reveal>
        <div className="surface-card space-y-6 p-8 md:p-14">
          <span className="eyebrow">{section.label}</span>
          <EditableText
            as="h2"
            className="display-md"
            value={section.title}
            onChange={(v) => patch((s) => void (s.title = v))}
          />
          <EditableText
            as="p"
            multiline
            className="max-w-xl text-lg leading-relaxed text-muted-foreground"
            value={section.body}
            onChange={(v) => patch((s) => void (s.body = v))}
          />
          <LinkEditor
            links={section.links}
            render="cta"
            withVariant
            onChange={(links) => patch((s) => void (s.links = links))}
          />
        </div>
      </Reveal>
    </SectionShell>
  );
}

/* -------------------------------- dispatcher ------------------------------ */

export function SectionRenderer({ section, index }: { section: Section; index: number }) {
  switch (section.kind) {
    case "about":
      return <AboutSection section={section} index={index} />;
    case "impact":
      return <ImpactSection section={section} index={index} />;
    case "experience":
      return <ExperienceSection section={section} index={index} />;
    case "projects":
      return <ProjectsSection section={section} index={index} />;
    case "skills":
      return <SkillsSection section={section} index={index} />;
    case "testimonials":
      return <TestimonialsSection section={section} index={index} />;
    case "education":
      return <EducationSection section={section} index={index} />;
    case "contact":
      return <ContactSection section={section} index={index} />;
    default:
      return null;
  }
}
