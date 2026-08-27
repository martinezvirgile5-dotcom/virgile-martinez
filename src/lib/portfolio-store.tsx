import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Context, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mergeContent, type PortfolioContent } from "./portfolio-content";
import { applyDictionary, collectStrings, missingStrings, type Locale } from "./i18n";
import { translateStrings } from "./translate.functions";

type Status = "loading" | "ready" | "error";

type Store = {
  content: PortfolioContent;
  status: Status;
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  dirty: boolean;
  saving: boolean;
  update: (recipe: (draft: PortfolioContent) => void) => void;
  save: () => Promise<void>;
  reload: () => Promise<void>;
  mode: "light" | "dark";
  toggleMode: () => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  translating: boolean;
  translateAll: (options?: { force?: boolean }) => Promise<number>;
  missingCount: number;
};

type PortfolioGlobal = typeof globalThis & {
  __portfolioContext?: Context<Store | null>;
};

// Keep one context identity across Vite hot updates. Without this, a provider
// from the previous module instance can briefly coexist with consumers from
// the new instance, making useContext read the default null value.
const portfolioGlobal = globalThis as PortfolioGlobal;
const PortfolioContext =
  portfolioGlobal.__portfolioContext ?? createContext<Store | null>(null);
portfolioGlobal.__portfolioContext = PortfolioContext;

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PortfolioContent>(() => mergeContent(null));
  const [status, setStatus] = useState<Status>("loading");
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [locale, setLocale] = useState<Locale>("fr");
  const [translating, setTranslating] = useState(false);
  const loaded = useRef(false);

  const reload = useCallback(async () => {
    const { data, error } = await supabase.from("site_content").select("data").eq("id", "main").maybeSingle();
    if (error) {
      setStatus("error");
      return;
    }
    setContent(mergeContent(data?.data));
    setDirty(false);
    setStatus("ready");
  }, []);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    void reload();
  }, [reload]);

  useEffect(() => {
    const storedLocale = window.localStorage.getItem("portfolio-locale");
    if (storedLocale === "en" || storedLocale === "fr") setLocale(storedLocale);
    else if (navigator.language && !navigator.language.toLowerCase().startsWith("fr")) setLocale("en");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("portfolio-locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const stored = window.localStorage.getItem("portfolio-mode");
    if (stored === "dark" || stored === "light") setMode(stored);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setMode("dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    window.localStorage.setItem("portfolio-mode", mode);
  }, [mode]);

  const checkRole = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setIsAdmin(false);
      setEditMode(false);
      return;
    }
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin");
    setIsAdmin((data?.length ?? 0) > 0);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      void checkRole(session?.user?.id);
    });
    void supabase.auth.getSession().then(({ data }) => checkRole(data.session?.user?.id));
    return () => sub.subscription.unsubscribe();
  }, [checkRole]);

  const update = useCallback((recipe: (draft: PortfolioContent) => void) => {
    setContent((current) => {
      const draft = clone(current);
      recipe(draft);
      return draft;
    });
    setDirty(true);
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_content")
      .upsert({ id: "main", data: content as unknown as never })
      .eq("id", "main");
    setSaving(false);
    if (error) throw error;
    setDirty(false);
  }, [content]);

  const translateAll = useCallback(
    async (options?: { force?: boolean }) => {
      const targets = options?.force
        ? collectStrings(content)
        : missingStrings(content, content.translations?.en);
      if (targets.length === 0) return 0;
      setTranslating(true);
      try {
        const { dictionary } = await translateStrings({ data: { strings: targets.slice(0, 400) } });
        update((draft) => {
          draft.translations = { en: { ...(draft.translations?.en ?? {}), ...dictionary } };
        });
        return Object.keys(dictionary).length;
      } finally {
        setTranslating(false);
      }
    },
    [content, update],
  );

  const toggleLocale = useCallback(() => setLocale((l) => (l === "fr" ? "en" : "fr")), []);

  const toggleMode = useCallback(() => setMode((m) => (m === "dark" ? "light" : "dark")), []);

  // Edition always happens on the French source document.
  const editing = isAdmin && editMode;
  const translated = useMemo(
    () => (locale === "en" && !editing ? applyDictionary(content, content.translations?.en) : content),
    [content, locale, editing],
  );
  const missingCount = useMemo(() => missingStrings(content, content.translations?.en).length, [content]);

  const value = useMemo<Store>(
    () => ({
      content: translated,
      status,
      isAdmin,
      editMode: isAdmin && editMode,
      setEditMode,
      dirty,
      saving,
      update,
      save,
      reload,
      mode,
      toggleMode,
      locale,
      setLocale,
      toggleLocale,
      translating,
      translateAll,
      missingCount,
    }),
    [
      translated,
      status,
      isAdmin,
      editMode,
      dirty,
      saving,
      update,
      save,
      reload,
      mode,
      toggleMode,
      locale,
      toggleLocale,
      translating,
      translateAll,
      missingCount,
    ],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): Store {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used inside PortfolioProvider");
  return ctx;
}

const TEN_YEARS = 60 * 60 * 24 * 3650;

export async function uploadMedia(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("portfolio").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data, error: signError } = await supabase.storage.from("portfolio").createSignedUrl(path, TEN_YEARS);
  if (signError || !data) throw signError ?? new Error("URL indisponible");
  return data.signedUrl;
}
