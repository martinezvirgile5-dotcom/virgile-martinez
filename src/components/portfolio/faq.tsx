import { usePortfolio } from "@/lib/portfolio-store";
import { uid, type FaqItem, type PortfolioContent } from "@/lib/portfolio-content";
import { EditableText, ItemToolbar, Reveal, move } from "./editable";

const addBtn =
  "no-print mt-8 inline-flex items-center gap-2 rounded-full border border-dashed border-border-strong px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground";

export function FaqSection() {
  const { content, update, editMode } = usePortfolio();
  const faq = content.faq;

  const patch = (recipe: (draft: PortfolioContent["faq"]) => void) =>
    update((draft) => recipe(draft.faq));
  const setItems = (fn: (items: FaqItem[]) => FaqItem[]) => patch((f) => void (f.items = fn(f.items)));
  const patchItem = (id: string, next: Partial<FaqItem>) =>
    setItems((items) => items.map((it) => (it.id === id ? { ...it, ...next } : it)));

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
        {faq.items.map((item, i) => (
          <Reveal key={item.id} delay={i * 50} className="py-6">
            <EditableText
              as="h2"
              className="text-lg font-medium tracking-tight"
              value={item.question}
              onChange={(v) => patchItem(item.id, { question: v })}
            />
            <EditableText
              as="p"
              multiline
              placeholder="Votre réponse…"
              className="mt-3 leading-relaxed text-muted-foreground"
              value={item.answer}
              onChange={(v) => patchItem(item.id, { answer: v })}
            />
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
        ))}
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
