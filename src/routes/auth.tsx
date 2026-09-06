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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Revalidate the stored session: a stale/revoked token must be cleared,
    // otherwise the page keeps bouncing instead of letting the owner sign in.
    void supabase.auth.getUser().then(async ({ data, error }) => {
      if (data?.user && !error) {
        void navigate({ to: "/" });
        return;
      }
      const { data: session } = await supabase.auth.getSession();
      if (session.session) await supabase.auth.signOut({ scope: "local" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error || !data.session) {
      setMessage(error?.message ?? "Connexion impossible, réessayez.");
      return;
    }
    // Full navigation so the freshly stored session is picked up everywhere.
    window.location.assign("/");
  };


  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="link-underline text-xs text-muted-foreground">
          ← Retour au portfolio
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Espace d'édition</h1>
        <p className="mt-2 text-sm text-muted-foreground">Réservé au propriétaire du site.</p>
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
            autoComplete="current-password"
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
            {loading ? "…" : "Se connecter"}
          </button>
        </form>
        {message && <p className="mt-3 text-xs text-destructive">{message}</p>}
      </div>
    </main>
  );
}
