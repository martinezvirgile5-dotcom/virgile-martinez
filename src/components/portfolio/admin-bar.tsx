import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, Languages, LogOut, Palette, Pencil, Plus, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePortfolio } from "@/lib/portfolio-store";
import { emptySection, sectionKindLabels, type SectionKind } from "@/lib/portfolio-content";
import { cn } from "@/lib/utils";

const chip =
  "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition-colors border border-border bg-card hover:bg-accent";

export function AdminBar() {
  const { isAdmin, editMode, setEditMode, dirty, saving, save, reload, content, translateAll, translating, missingCount } =
    usePortfolio();
  const [panel, setPanel] = useState<"none" | "theme" | "sections">("none");
  const navigate = useNavigate();

  if (!isAdmin) return null;

  const onSave = async () => {
    try {
      await save();
      toast.success("Modifications publiées");
    } catch {
      toast.error("Échec de l'enregistrement");
    }
  };

  return (
    <div className="no-print fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 print:hidden">
      <div className="w-full max-w-3xl space-y-3">
        {panel === "theme" && <ThemePanel />}
        {panel === "sections" && <SectionsPanel onAdd={() => setPanel("none")} />}

        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-popover/95 p-2 shadow-bar backdrop-blur">
          <button
            type="button"
            className={cn(chip, editMode && "border-brand bg-brand text-brand-foreground hover:bg-brand")}
            onClick={() => setEditMode(!editMode)}
          >
            <Pencil className="size-3.5" />
            {editMode ? "Mode édition actif" : "Modifier"}
          </button>
          <button
            type="button"
            disabled={translating}
            className={cn(chip, "disabled:opacity-50")}
            onClick={async () => {
              try {
                const count = await translateAll();
                toast.success(
                  count > 0
                    ? `${count} textes traduits en anglais — pensez à publier`
                    : "Traduction anglaise déjà à jour",
                );
              } catch {
                toast.error("Échec de la traduction automatique");
              }
            }}
          >
            <Languages className="size-3.5" />
            {translating ? "Traduction…" : missingCount > 0 ? `Traduire (${missingCount})` : "Traduction à jour"}
          </button>
          <button type="button" className={chip} onClick={() => setPanel(panel === "theme" ? "none" : "theme")}>
            <Palette className="size-3.5" />
            Thème
          </button>
          <button type="button" className={chip} onClick={() => setPanel(panel === "sections" ? "none" : "sections")}>
            <Plus className="size-3.5" />
            Section
          </button>
          <button
            type="button"
            className={cn(chip, "hidden sm:inline-flex")}
            onClick={() => {
              void reload();
              toast.info("Contenu rechargé depuis la dernière publication");
            }}
          >
            <RotateCcw className="size-3.5" />
            Annuler
          </button>
          <button
            type="button"
            disabled={saving || !dirty}
            className={cn(
              chip,
              "border-transparent bg-brand text-brand-foreground hover:brightness-110 disabled:opacity-40",
            )}
            onClick={onSave}
          >
            {dirty ? <Save className="size-3.5" /> : <Check className="size-3.5" />}
            {saving ? "Publication…" : dirty ? "Publier" : "À jour"}
          </button>
          <button
            type="button"
            className={cn(chip, "ml-auto")}
            onClick={async () => {
              await supabase.auth.signOut();
              await navigate({ to: "/" });
            }}
          >
            <LogOut className="size-3.5" />
            Quitter
          </button>
        </div>
        {editMode && (
          <p className="text-center text-xs text-muted-foreground">
            Cliquez sur n'importe quel texte pour le modifier. Pensez à publier —{" "}
            <span className="font-medium">{content.sections.length} sections</span>.
          </p>
        )}
        {editMode && <SeoPanel />}
        {!editMode && dirty && (
          <p className="text-center text-xs text-muted-foreground">Modifications non publiées.</p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "rounded-md border border-input bg-card px-2 py-1 text-xs",
          type === "color" ? "size-8 cursor-pointer p-0.5" : "w-48",
        )}
      />
    </label>
  );
}

function ThemePanel() {
  const { content, update, mode } = usePortfolio();
  const theme = content.theme;
  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-popover/95 p-4 shadow-bar backdrop-blur sm:grid-cols-3">
      <div className="space-y-2">
        <p className="eyebrow">Accent</p>
        <Field
          label="Couleur"
          type="color"
          value={theme.accent}
          onChange={(v) => update((d) => void (d.theme.accent = v))}
        />
      </div>
      <div className="space-y-2">
        <p className="eyebrow">Mode clair</p>
        <Field
          label="Fond"
          type="color"
          value={theme.light.background}
          onChange={(v) => update((d) => void (d.theme.light.background = v))}
        />
        <Field
          label="Texte"
          type="color"
          value={theme.light.foreground}
          onChange={(v) => update((d) => void (d.theme.light.foreground = v))}
        />
      </div>
      <div className="space-y-2">
        <p className="eyebrow">Mode sombre</p>
        <Field
          label="Fond"
          type="color"
          value={theme.dark.background}
          onChange={(v) => update((d) => void (d.theme.dark.background = v))}
        />
        <Field
          label="Texte"
          type="color"
          value={theme.dark.foreground}
          onChange={(v) => update((d) => void (d.theme.dark.foreground = v))}
        />
      </div>
      <p className="text-xs text-muted-foreground sm:col-span-3">
        Aperçu en mode {mode === "dark" ? "sombre" : "clair"} — basculez avec le bouton en haut à droite.
      </p>
    </div>
  );
}

function SeoPanel() {
  const { content, update } = usePortfolio();
  return (
    <div className="space-y-2 rounded-2xl border border-border bg-popover/95 p-4 shadow-bar backdrop-blur">
      <p className="eyebrow">Référencement & partage</p>
      <label className="block text-xs text-muted-foreground">
        Titre de la page
        <input
          className="mt-1 w-full rounded-md border border-input bg-card px-2 py-1 text-xs text-foreground"
          value={content.seo.title}
          onChange={(e) => update((d) => void (d.seo.title = e.target.value))}
        />
      </label>
      <label className="block text-xs text-muted-foreground">
        Description
        <textarea
          rows={2}
          className="mt-1 w-full resize-none rounded-md border border-input bg-card px-2 py-1 text-xs text-foreground"
          value={content.seo.description}
          onChange={(e) => update((d) => void (d.seo.description = e.target.value))}
        />
      </label>
    </div>
  );
}

function SectionsPanel({ onAdd }: { onAdd: () => void }) {
  const { update } = usePortfolio();
  const kinds = Object.keys(sectionKindLabels) as SectionKind[];
  return (
    <div className="rounded-2xl border border-border bg-popover/95 p-4 shadow-bar backdrop-blur">
      <p className="eyebrow mb-3">Ajouter une section</p>
      <div className="flex flex-wrap gap-2">
        {kinds.map((kind) => (
          <button
            key={kind}
            type="button"
            className={chip}
            onClick={() => {
              update((d) => void d.sections.push(emptySection(kind)));
              onAdd();
            }}
          >
            <Plus className="size-3.5" />
            {sectionKindLabels[kind]}
          </button>
        ))}
      </div>
    </div>
  );
}
