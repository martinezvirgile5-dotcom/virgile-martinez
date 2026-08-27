// Content model for the portfolio. The whole document is stored as one JSON
// row in `site_content` so the admin can edit / reorder anything in place.

export type LinkItem = {
  id: string;
  label: string;
  url: string;
  variant?: "primary" | "secondary" | "ghost" | undefined;
};

export type Position = {
  id: string;
  role: string;
  period: string;
  achievements: string[];
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string | undefined;
  logoUrl?: string | undefined;
  achievements: string[];
  /** Postes supplémentaires occupés dans la même entreprise (promotions, mobilité). */
  positions?: Position[] | undefined;
  links: LinkItem[];
};

export type Project = {
  id: string;
  name: string;
  tagline: string;
  problem: string;
  approach: string;
  decisions: string;
  results: string;
  imageUrl?: string | undefined;
  links: LinkItem[];
};

export type SkillGroup = { id: string; name: string; items: string };
export type Metric = { id: string; value: string; label: string };
export type Testimonial = { id: string; quote: string; name: string; role: string };
export type Education = { id: string; title: string; org: string; period: string; links: LinkItem[] };

export type SectionKind =
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "impact"
  | "testimonials"
  | "education"
  | "contact";

type Base = { id: string; kind: SectionKind; label: string; title: string; visible: boolean };

export type Section =
  | (Base & { kind: "about"; body: string })
  | (Base & { kind: "experience"; items: Experience[] })
  | (Base & { kind: "projects"; items: Project[] })
  | (Base & { kind: "skills"; groups: SkillGroup[] })
  | (Base & { kind: "impact"; items: Metric[] })
  | (Base & { kind: "testimonials"; items: Testimonial[] })
  | (Base & { kind: "education"; items: Education[] })
  | (Base & { kind: "contact"; body: string; links: LinkItem[] });

export type Theme = {
  accent: string;
  light: { background: string; foreground: string };
  dark: { background: string; foreground: string };
};

export type PortfolioContent = {
  version: 1;
  theme: Theme;
  hero: {
    firstName: string;
    lastName: string;
    title: string;
    tagline: string;
    availability: string;
    portraitUrl?: string | undefined;
    cvUrl: string;
    ctas: LinkItem[];
  };
  seo: { title: string; description: string };
  sections: Section[];
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export const defaultContent: PortfolioContent = {
  version: 1,
  theme: {
    accent: "#2f6bff",
    light: { background: "#fafaf8", foreground: "#1b1b1f" },
    dark: { background: "#0e0f12", foreground: "#f3f3f1" },
  },
  hero: {
    firstName: "Virgile",
    lastName: "Martinez",
    title: "Senior Product Manager",
    tagline:
      "Je transforme des problèmes flous en produits qui bougent les métriques. 8 ans à construire des produits B2B SaaS, de la discovery au scale.",
    availability: "Ouvert aux opportunités · Paris / remote",
    cvUrl: "",
    ctas: [
      { id: uid(), label: "Voir mes études de cas", url: "#projets", variant: "primary" },
      { id: uid(), label: "Me contacter", url: "#contact", variant: "secondary" },
    ],
  },
  seo: {
    title: "Virgile Martinez — Senior Product Manager",
    description:
      "Portfolio produit de Virgile Martinez, Senior Product Manager : études de cas, décisions clés et impact chiffré.",
  },
  sections: [
    {
      id: uid(),
      kind: "about",
      label: "À propos",
      title: "Ma façon de faire du produit",
      visible: true,
      body: "Je crois qu'un bon PM est d'abord un bon éditeur : savoir ce qu'on retire compte autant que ce qu'on ajoute. Je travaille par cycles courts — problème formulé noir sur blanc, hypothèse chiffrée, plus petit test possible — et je passe beaucoup de temps avec les utilisateurs et les données avant d'écrire une ligne de spec. J'aime les équipes où le design et l'engineering challengent le produit, et où la roadmap se défend avec des faits.",
    },
    {
      id: uid(),
      kind: "impact",
      label: "Impact",
      title: "Quelques résultats",
      visible: true,
      items: [
        { id: uid(), value: "+40%", label: "rétention à 90 jours sur le produit cœur" },
        { id: uid(), value: "€2M", label: "d'ARR généré par les lancements pilotés" },
        { id: uid(), value: "3", label: "produits lancés de 0 à 1" },
        { id: uid(), value: "-32%", label: "de temps d'onboarding client" },
      ],
    },
    {
      id: uid(),
      kind: "experience",
      label: "Expériences",
      title: "Parcours",
      visible: true,
      items: [
        {
          id: uid(),
          company: "Northwind",
          role: "Senior Product Manager — Plateforme",
          period: "2022 — aujourd'hui",
          location: "Paris",
          achievements: [
            "Refonte de l'activation : +40% de rétention à 90 jours sur 18 000 comptes.",
            "Mise en place d'un framework de priorisation (impact / confiance / effort) adopté par les 4 squads.",
            "Lancement du module facturation : €1,2M d'ARR incrémental en 3 trimestres.",
          ],
          links: [{ id: uid(), label: "Étude de cas", url: "" }],
        },
        {
          id: uid(),
          company: "Lumen Analytics",
          role: "Product Manager — Growth",
          period: "2019 — 2022",
          location: "Lyon",
          achievements: [
            "Programme d'expérimentation : 47 A/B tests, +18% de conversion trial → paid.",
            "Discovery continue (12 entretiens/mois) qui a réorienté la roadmap Q3 vers le self-serve.",
            "Passage de l'analytics maison à Amplitude, adoption par 80% des équipes produit.",
          ],
          links: [],
        },
        {
          id: uid(),
          company: "Atelier Kite",
          role: "Product Owner",
          period: "2017 — 2019",
          location: "Nantes",
          achievements: [
            "Premier produit mobile de l'agence, 60 000 téléchargements la première année.",
            "Mise en place du dual-track agile avec 3 développeurs et 1 designer.",
          ],
          links: [],
        },
      ],
    },
    {
      id: uid(),
      kind: "projects",
      label: "Études de cas",
      title: "Études de cas",
      visible: true,
      items: [
        {
          id: uid(),
          name: "Refonte de l'activation",
          tagline: "Faire passer un onboarding de 9 étapes à un premier succès en 4 minutes.",
          problem:
            "62% des nouveaux comptes n'atteignaient jamais leur premier «moment de valeur». L'onboarding demandait 9 étapes et un import de données avant tout usage.",
          approach:
            "18 entretiens utilisateurs, replay de 200 sessions, analyse de funnel par cohorte. Hypothèse : le blocage n'est pas la complexité mais l'absence de résultat visible avant l'effort.",
          decisions:
            "Inverser l'ordre : données de démonstration d'abord, import ensuite. Couper 4 étapes du formulaire. Refuser l'ajout d'un tutoriel vidéo réclamé par le sales, mesuré comme non prédictif.",
          results:
            "Temps jusqu'au premier succès : 22 min → 4 min. Rétention à 90 jours +40%. Tickets support d'onboarding -32%.",
          links: [{ id: uid(), label: "Voir sur Notion", url: "" }],
        },
        {
          id: uid(),
          name: "Module facturation",
          tagline: "Du 0 à 1 sur un module attendu par 40% du parc client.",
          problem:
            "Les clients exportaient nos données pour facturer ailleurs. Churn annoncé de 3 comptes entreprise sur ce seul motif.",
          approach:
            "Cadrage avec finance et légal, 3 prototypes Figma testés en une semaine, pilote sur 12 comptes avant le build complet.",
          decisions:
            "Périmètre volontairement réduit à la facturation récurrente (pas d'usage-based en V1). Construction sur Stripe plutôt qu'en interne pour livrer en 2 trimestres.",
          results:
            "€1,2M d'ARR incrémental, 0 churn sur les comptes à risque, adoption par 38% du parc en 6 mois.",
          links: [{ id: uid(), label: "Démo vidéo", url: "" }],
        },
      ],
    },
    {
      id: uid(),
      kind: "skills",
      label: "Compétences",
      title: "Compétences",
      visible: true,
      groups: [
        {
          id: uid(),
          name: "Produit",
          items: "Discovery, roadmapping, priorisation, OKR, product strategy, dual-track agile",
        },
        { id: uid(), name: "Data", items: "SQL, Amplitude, A/B testing, analyse de cohortes, dashboards" },
        { id: uid(), name: "Outils", items: "Jira, Linear, Figma, Notion, Metabase, Stripe" },
        {
          id: uid(),
          name: "Soft skills",
          items: "Facilitation, communication exécutive, mentorat, arbitrage sous contrainte",
        },
      ],
    },
    {
      id: uid(),
      kind: "testimonials",
      label: "Recommandations",
      title: "Ce qu'en disent mes équipes",
      visible: true,
      items: [
        {
          id: uid(),
          quote:
            "Virgile est le premier PM avec qui j'ai travaillé qui sait dire non avec des chiffres. La roadmap n'a jamais été aussi lisible.",
          name: "Camille Roy",
          role: "VP Engineering, Northwind",
        },
        {
          id: uid(),
          quote:
            "Il arrive en réunion avec le problème déjà cadré et trois options chiffrées. Ça change tout pour une équipe design.",
          name: "Sofia Neves",
          role: "Head of Design, Lumen Analytics",
        },
      ],
    },
    {
      id: uid(),
      kind: "education",
      label: "Formation",
      title: "Formation & certifications",
      visible: true,
      items: [
        { id: uid(), title: "MSc Management de l'innovation", org: "EM Lyon", period: "2015 — 2017", links: [] },
        { id: uid(), title: "Reforge — Product Strategy", org: "Reforge", period: "2023", links: [] },
        { id: uid(), title: "SQL for Product Managers", org: "DataCamp", period: "2021", links: [] },
      ],
    },
    {
      id: uid(),
      kind: "contact",
      label: "Contact",
      title: "Parlons produit",
      visible: true,
      body: "Une équipe à renforcer, un produit à cadrer, ou juste envie d'échanger sur la discovery ? Écrivez-moi, je réponds sous 24 h.",
      links: [
        { id: uid(), label: "Email", url: "mailto:bonjour@exemple.com", variant: "primary" },
        { id: uid(), label: "LinkedIn", url: "https://linkedin.com/in/", variant: "secondary" },
        { id: uid(), label: "Réserver 20 min", url: "https://calendly.com/", variant: "secondary" },
      ],
    },
  ],
};

export function emptySection(kind: SectionKind): Section {
  const base = { id: uid(), visible: true };
  switch (kind) {
    case "about":
      return { ...base, kind, label: "À propos", title: "Nouveau bloc texte", body: "Votre texte ici." };
    case "experience":
      return { ...base, kind, label: "Expériences", title: "Parcours", items: [emptyExperience()] };
    case "projects":
      return { ...base, kind, label: "Études de cas", title: "Études de cas", items: [emptyProject()] };
    case "skills":
      return {
        ...base,
        kind,
        label: "Compétences",
        title: "Compétences",
        groups: [{ id: uid(), name: "Catégorie", items: "compétence, compétence" }],
      };
    case "impact":
      return {
        ...base,
        kind,
        label: "Impact",
        title: "Résultats clés",
        items: [{ id: uid(), value: "+00%", label: "métrique" }],
      };
    case "testimonials":
      return {
        ...base,
        kind,
        label: "Recommandations",
        title: "Recommandations",
        items: [{ id: uid(), quote: "Citation courte.", name: "Prénom Nom", role: "Fonction, entreprise" }],
      };
    case "education":
      return {
        ...base,
        kind,
        label: "Formation",
        title: "Formation & certifications",
        items: [{ id: uid(), title: "Diplôme", org: "École", period: "20XX", links: [] }],
      };
    case "contact":
      return {
        ...base,
        kind,
        label: "Contact",
        title: "Contact",
        body: "Comment me joindre.",
        links: [{ id: uid(), label: "Email", url: "mailto:", variant: "primary" }],
      };
  }
}

export const emptyExperience = (): Experience => ({
  id: uid(),
  company: "Entreprise",
  role: "Intitulé du poste",
  period: "20XX — 20XX",
  location: "Ville",
  achievements: ["Réalisation clé avec une métrique."],
  links: [],
});

export const emptyProject = (): Project => ({
  id: uid(),
  name: "Nouveau projet",
  tagline: "Une phrase qui résume l'enjeu.",
  problem: "Quel problème, pour qui, avec quelle preuve ?",
  approach: "Comment vous avez exploré : entretiens, données, prototypes.",
  decisions: "Les arbitrages faits — et ceux refusés.",
  results: "Les résultats chiffrés.",
  links: [],
});

export const sectionKindLabels: Record<SectionKind, string> = {
  about: "Texte / À propos",
  experience: "Expériences",
  projects: "Études de cas",
  skills: "Compétences",
  impact: "Résultats clés",
  testimonials: "Recommandations",
  education: "Formation",
  contact: "Contact",
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function mergeContent(raw: unknown): PortfolioContent {
  if (!raw || typeof raw !== "object" || !("sections" in raw)) return defaultContent;
  const value = raw as PortfolioContent;
  return {
    ...defaultContent,
    ...value,
    theme: { ...defaultContent.theme, ...value.theme },
    hero: { ...defaultContent.hero, ...value.hero },
    seo: { ...defaultContent.seo, ...value.seo },
    sections: Array.isArray(value.sections) ? value.sections : defaultContent.sections,
  };
}
