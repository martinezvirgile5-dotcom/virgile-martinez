# CV Virgile Martinez

Prompt à coller dans Lovable

Crée une application web appelée "[Ton Prénom] — Product Manager", un site portfolio/CV en ligne immersif, moderne et éditable, destiné à être partagé directement à des recruteurs via une URL publique.

1. Objectif

Ce n'est pas un CV PDF classique : c'est une expérience web one-page, scrollable, qui présente mon parcours de Product Manager avec une narration visuelle forte (storytelling produit : problème → décisions → impact chiffré). Le site doit donner immédiatement une impression de rigueur produit et de sens du détail UX.

2. Style visuel attendu

Design moderne, épuré, "tech/SaaS premium" (inspiration : Linear, Notion, Arc Browser) — pas un template CV générique.

Typographie soignée avec une hiérarchie claire (grand titre d'accroche, sous-titres nets).

Palette de couleurs sobre par défaut (ex: fond clair ou dark mode, un accent coloré unique) mais entièrement personnalisable (voir section édition).

Micro-interactions : animations d'apparition au scroll, transitions douces au survol des cartes, sans surcharge.

Responsive parfait mobile/desktop.

Un toggle dark mode / light mode.

3. Fonctionnalités d'édition (essentiel)

Je dois pouvoir, sans coder :

Modifier tous les textes directement en ligne (titres, paragraphes, intitulés de poste).

Ajouter, réordonner ou supprimer des sections/blocs (expériences, projets, compétences).

Changer les couleurs du thème (couleur d'accent, fond, texte) via un panneau de personnalisation simple.

Uploader ou remplacer des images/logos d'entreprises.

Coller des liens hypertextes n'importe où (LinkedIn, GitHub, Notion, études de cas, vidéos de démo, Calendly, portfolio Figma, etc.), avec un rendu propre (bouton ou lien stylé, pas juste une URL brute).

Dupliquer facilement un bloc "expérience" ou "projet" pour en ajouter un nouveau.

4. Structure du contenu (sections)

Hero : Prénom + Nom, titre ("Product Manager"), une phrase d'accroche percutante, CTA principal ("Voir mes projets" / "Me contacter"), lien vers le CV PDF téléchargeable.

À propos : court paragraphe sur mon approche produit, ma philosophie, ce qui me distingue.

Expériences professionnelles : timeline ou cartes avec entreprise, poste, dates, 2-3 réalisations clés par poste, idéalement avec des métriques (croissance, rétention, revenus, adoption).

Projets / Études de cas (le cœur du portfolio) : pour chaque projet, un bloc structuré Problème → Approche/Process → Décisions clés → Résultats chiffrés, avec possibilité d'ajouter des visuels (maquettes, dashboards, schémas) et un lien externe (Notion, Figma, vidéo démo).

Compétences : regroupées par catégorie — Produit (roadmapping, discovery, prioritisation, OKR), Data (SQL, Amplitude, A/B testing), Outils (Jira, Figma, Notion), Soft skills.

Résultats clés / Impact : une section avec quelques chiffres mis en avant en gros format (ex: "+40% rétention", "3 lancements produits", "€2M ARR généré").

Recommandations / Témoignages (optionnel, éditable) : citations courtes de managers ou collègues, avec nom et fonction.

Formation & Certifications.

Contact : boutons vers email, LinkedIn, Calendly, et téléchargement du CV en PDF.

5. Technique

Le site doit être publiable en un clic sur une URL publique unique et stable, partageable directement à des recruteurs.

Chargement rapide, SEO de base (title, meta description avec mon nom et "Product Manager").

Un bouton "Télécharger en PDF" qui génère une version imprimable/classique du CV à partir du même contenu.

Aucune connexion/authentification requise pour les visiteurs (accès public en lecture).

Interface d'édition accessible uniquement à moi (mode admin simple), le reste du monde voit la version publique en lecture seule.

6. Ton et exemple de contenu de démarrage

Génère un premier jet de contenu placeholder cohérent avec un profil de Product Manager (exemples de projets, métriques fictives réalistes) que je pourrai ensuite remplacer par mes vraies informations.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://virgile-martinez.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1ec75747-78ba-4f3e-bfe3-34a900b4c24c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
