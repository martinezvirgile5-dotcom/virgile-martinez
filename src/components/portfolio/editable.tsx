import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Copy, ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadMedia, usePortfolio } from "@/lib/portfolio-store";
import { uid, type LinkItem } from "@/lib/portfolio-content";

/* ---------------------------------- texte --------------------------------- */

export function EditableText({
  value,
  onChange,
  as: Tag = "span",
  className,
  multiline = false,
  placeholder = "Écrire…",
}: {
  value: string;
  onChange: (next: string) => void;
  as?: ElementType;
  className?: string | undefined;
  multiline?: boolean | undefined;
  placeholder?: string;
}) {
  const { editMode } = usePortfolio();
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (multiline && ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [multiline, value, editMode]);

  if (!editMode) {
    return <Tag className={cn(multiline && "whitespace-pre-line", className)}>{value}</Tag>;
  }

  const shared = cn(
    "w-full resize-none rounded-md bg-brand-soft/60 outline-none ring-1 ring-border-strong/50 focus:ring-2 focus:ring-ring px-1.5 -mx-1.5 py-0.5",
    multiline && "whitespace-pre-line",
    className,
  );

  if (multiline) {
    return (
      <textarea
        ref={ref}
        className={shared}
        value={value}
        rows={2}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <input className={shared} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  );
}

/* ------------------------------- apparitions ------------------------------ */

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string | undefined;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-8% 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", shown && "reveal-in", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* --------------------------------- boutons -------------------------------- */

const ctaClasses: Record<NonNullable<LinkItem["variant"]>, string> = {
  primary:
    "bg-brand text-brand-foreground hover:brightness-110 shadow-[0_10px_28px_-14px_var(--brand)] border border-transparent",
  secondary: "bg-card text-foreground border border-border-strong hover:bg-accent",
  ghost: "text-foreground border border-transparent hover:bg-accent",
};

export function CtaLink({ link, className }: { link: LinkItem; className?: string }) {
  const external = /^https?:/i.test(link.url);
  return (
    <a
      href={link.url || "#"}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
        ctaClasses[link.variant ?? "secondary"],
        className,
      )}
    >
      {link.label}
    </a>
  );
}

export function InlineLink({ link }: { link: LinkItem }) {
  const external = /^https?:/i.test(link.url);
  return (
    <a
      href={link.url || "#"}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className="link-underline text-sm font-medium text-brand"
    >
      {link.label} ↗
    </a>
  );
}

export function LinkEditor({
  links,
  onChange,
  render = "inline",
  withVariant = false,
}: {
  links: LinkItem[];
  onChange: (next: LinkItem[]) => void;
  render?: "inline" | "cta" | undefined;
  withVariant?: boolean | undefined;
}) {
  const { editMode } = usePortfolio();

  if (!editMode) {
    const visible = links.filter((l) => l.label.trim() && l.url.trim());
    if (!visible.length) return null;
    return (
      <div className={cn("flex flex-wrap items-center", render === "cta" ? "gap-3" : "gap-4")}>
        {visible.map((link) =>
          render === "cta" ? <CtaLink key={link.id} link={link} /> : <InlineLink key={link.id} link={link} />,
        )}
      </div>
    );
  }

  const patch = (id: string, next: Partial<LinkItem>) =>
    onChange(links.map((l) => (l.id === id ? { ...l, ...next } : l)));

  return (
    <div className="space-y-2 rounded-lg border border-dashed border-border-strong/60 p-2">
      {links.map((link) => (
        <div key={link.id} className="flex flex-wrap items-center gap-2">
          <input
            className="w-32 rounded-md border border-input bg-card px-2 py-1 text-xs"
            value={link.label}
            placeholder="Libellé"
            onChange={(e) => patch(link.id, { label: e.target.value })}
          />
          <input
            className="min-w-40 flex-1 rounded-md border border-input bg-card px-2 py-1 text-xs"
            value={link.url}
            placeholder="https://… ou mailto:…"
            onChange={(e) => patch(link.id, { url: e.target.value })}
          />
          {withVariant && (
            <select
              className="rounded-md border border-input bg-card px-2 py-1 text-xs"
              value={link.variant ?? "secondary"}
              onChange={(e) => patch(link.id, { variant: e.target.value as LinkItem["variant"] })}
            >
              <option value="primary">Principal</option>
              <option value="secondary">Secondaire</option>
              <option value="ghost">Discret</option>
            </select>
          )}
          <button
            type="button"
            aria-label="Supprimer le lien"
            className="rounded-md p-1 text-muted-foreground hover:bg-accent"
            onClick={() => onChange(links.filter((l) => l.id !== link.id))}
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-xs font-medium text-brand hover:underline"
        onClick={() => onChange([...links, { id: uid(), label: "Nouveau lien", url: "", variant: "secondary" }])}
      >
        + Ajouter un lien
      </button>
    </div>
  );
}

/* ---------------------------------- images -------------------------------- */

export function ImageField({
  url,
  onChange,
  className,
  imgClassName,
  alt,
  hint = "Image",
}: {
  url?: string | undefined;
  onChange: (next: string | undefined) => void;
  className?: string | undefined;
  imgClassName?: string | undefined;
  alt: string;
  hint?: string | undefined;
}) {
  const { editMode } = usePortfolio();
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement | null>(null);

  if (!editMode && !url) return null;

  return (
    <div className={cn("relative", className)}>
      {url ? (
        <img src={url} alt={alt} loading="lazy" className={cn("h-full w-full object-cover", imgClassName)} />
      ) : (
        <div className="flex h-full min-h-24 w-full items-center justify-center rounded-xl border border-dashed border-border-strong/70 bg-muted text-xs text-muted-foreground">
          {hint}
        </div>
      )}
      {editMode && (
        <div className="absolute right-2 top-2 flex gap-1">
          <input
            ref={input}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              try {
                onChange(await uploadMedia(file));
              } finally {
                setBusy(false);
                if (input.current) input.current.value = "";
              }
            }}
          />
          <button
            type="button"
            className="rounded-full bg-card/95 p-1.5 shadow-card"
            aria-label="Remplacer l'image"
            onClick={() => input.current?.click()}
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
          </button>
          {url && (
            <button
              type="button"
              className="rounded-full bg-card/95 p-1.5 shadow-card"
              aria-label="Retirer l'image"
              onClick={() => onChange(undefined)}
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- toolbars -------------------------------- */

export function ItemToolbar({
  onUp,
  onDown,
  onDuplicate,
  onDelete,
  className,
}: {
  onUp?: (() => void) | undefined;
  onDown?: (() => void) | undefined;
  onDuplicate?: (() => void) | undefined;
  onDelete?: (() => void) | undefined;
  className?: string | undefined;
}) {
  const { editMode } = usePortfolio();
  if (!editMode) return null;
  const btn = "rounded-md border border-border bg-card p-1.5 text-muted-foreground hover:text-foreground";
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {onUp && (
        <button type="button" className={btn} aria-label="Monter" onClick={onUp}>
          <ArrowUp className="size-3.5" />
        </button>
      )}
      {onDown && (
        <button type="button" className={btn} aria-label="Descendre" onClick={onDown}>
          <ArrowDown className="size-3.5" />
        </button>
      )}
      {onDuplicate && (
        <button type="button" className={btn} aria-label="Dupliquer" onClick={onDuplicate}>
          <Copy className="size-3.5" />
        </button>
      )}
      {onDelete && (
        <button type="button" className={btn} aria-label="Supprimer" onClick={onDelete}>
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  );
}

export function move<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const next = [...list];
  const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item as T);
  return next;
}
