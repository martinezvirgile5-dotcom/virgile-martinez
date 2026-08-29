import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePortfolio } from "@/lib/portfolio-store";
import { uid, type FaqItem, type PortfolioContent } from "@/lib/portfolio-content";
import { cn } from "@/lib/utils";
import { EditableText, ItemToolbar, Reveal, move } from "./editable";

const addBtn =
  "no-print mt-8 inline-flex items-center gap-2 rounded-full border border-dashed border-border-strong px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground";

export function FaqSection() {
  const { content, update, editMode } = usePortfolio();
  const faq = content.faq;
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const patch = (recipe: (draft: PortfolioContent["faq"]) => void) =>
    update((draft) => recipe(draft.faq));
  const setItems = (fn: (items: FaqItem[]) => FaqItem[]) => patch((f) => void (f.items = fn(f.items)));
  const patchItem = (id: string, next: Partial<FaqItem>) =>
    setItems((items) => items.map((it) => (it.id === id ? { ...it, ...next } : it)));

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-20 md:py-28">
      <Reveal className="mb-10 space-y-3">
        <span className="eyebrow">Questions & réponses</span>
        <EditableText
          as="h1"
          className="display-md"
          value={faq.title}
          onChange={(v) => patch((f) => void (f.title = v))}
        />
        <EditableText
          as="p"
          multiline
          className="max-w-xl text-lg leading-relaxed text-muted-foreground"
          value={faq.intro}
          onChange={(v) => patch((f) => void (f.intro = v))}
        />
      </Reveal>

      <div className="divide-y divide-border">
        {faq.items.map((item, i) => {
          const open = editMode || openIds.has(item.id);
          return (
            <Reveal key={item.id} delay={i * 50} className="py-6">
              <div
                role="button"
                tabIndex={editMode ? -1 : 0}
                aria-expanded={open}
                className={cn(
                  "flex items-center justify-between gap-4",
                  !editMode && "cursor-pointer select-none",
                )}
                onClick={() => !editMode && toggle(item.id)}
                onKeyDown={(e) => {
                  if (editMode) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(item.id);
                  }
                }}
              >
                <EditableText
                  as="h2"
                  className="flex-1 text-lg font-medium tracking-tight"
                  value={item.question}
                  onChange={(v) => patchItem(item.id, { question: v })}
                />
                {!editMode && (
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      open && "rotate-180",
                    )}
                  />
                )}
              </div>
              {open && (
                <div className="mt-3">
                  <EditableText
                    as="p"
                    multiline
                    placeholder="Votre réponse…"
                    className="leading-relaxed text-muted-foreground"
                    value={item.answer}
                    onChange={(v) => patchItem(item.id, { answer: v })}
                  />
                </div>
              )}
              {editMode && (
                <ItemToolbar
                  className="mt-3"
                  onUp={i > 0 ? () => setItems((items) => move(items, i, -1)) : undefined}
                  onDown={() => setItems((items) => move(items, i, 1))}
                  onDuplicate={() => setItems((items) => [...items, { ...item, id: uid() }])}
                  onDelete={() => setItems((items) => items.filter((it) => it.id !== item.id))}
                />
              )}
            </Reveal>
          );
        })}
      </div>

      {editMode && (
        <button
          type="button"
          className={addBtn}
          onClick={() => setItems((items) => [...items, { id: uid(), question: "Nouvelle question ?", answer: "" }])}
        >
          + Ajouter une question
        </button>
      )}
    </section>
  );
}
