import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Espace d'édition — Virgile Martinez" },
      { name: "description", content: "Connexion privée pour modifier le contenu du portfolio." },
      { property: "og:title", content: "Espace d'édition — Virgile Martinez" },
      { property: "og:description", content: "Connexion privée à l'éditeur du portfolio." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const fn =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/` },
          });
    const { error } = await fn;
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    await navigate({ to: "/" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="link-underline text-xs text-muted-foreground">
          ← Retour au portfolio
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Espace d'édition</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Réservé au propriétaire du site. Le premier compte créé devient administrateur.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-3">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm"
          />
          <input
            type="password"
            required
            minLength={8}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand px-3 py-2.5 text-sm font-medium text-brand-foreground transition-[filter] hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "…" : mode === "signin" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>
        {message && <p className="mt-3 text-xs text-destructive">{message}</p>}
        <button
          type="button"
          className="mt-4 text-xs text-muted-foreground underline"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Créer le compte administrateur" : "J'ai déjà un compte"}
        </button>
      </div>
    </main>
  );
}
