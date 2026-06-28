# Historique de Développement & État du Projet - Our Vietnamese Odyssey

Ce document sert de guide de reprise pour tout agent d'IA (Antigravity, Claude Code, etc.) ou développeur reprenant les travaux sur cette application. Il contient l'état actuel de la base de code, les détails de l'architecture, et les suggestions d'évolutions futures.

---

## 📋 Présentation du Projet
**"Our Vietnamese Odyssey"** est un carnet de voyage et album photo familial interactif premium racontant le périple de 40 jours d'Anthony, Hoa, Émilie et Yaya en Corée du Sud et au Vietnam (juillet - août 2026).
Il se distingue par son design haut de gamme d'inspiration éditoriale, son respect des espaces blancs, son support multilingue (Français et Vietnamien), son mode sombre et ses composants interactifs sur mesure.

---

## 🛠️ Stack Technique & Dépendances
- **Framework** : Next.js 16.2.9 (App Router, compilation Turbopack)
- **Runtime & Versioning** : Node.js (v24.18.0)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4 (avec variables CSS modernes configurées dans `globals.css`)
- **Animations** : Framer Motion v12.4.20
- **Internationalisation (i18n)** : `next-intl` v4.13.0 (gestion automatique des locales sous `/[locale]`)
- **Moteur MDX** : `next-mdx-remote` v6.0.0 (rendu dynamique d'articles Markdown locaux côté serveur)

---

## 📂 Architecture des Dossiers

```
our-vietnamese-odyssey/
├── content/                     # Contenu rédigé du blog
│   └── blog/                    # Articles au format MDX (.mdx)
├── messages/                    # Fichiers de dictionnaires i18n
│   ├── fr.json                  # Traductions françaises
│   └── vi.json                  # Traductions vietnamiennes
├── public/                     # Assets statiques (redirections, favicon, etc.)
├── scripts/
│   └── upload-to-r2.mjs         # Script d'upload récursif vers Cloudflare R2
├── src/
│   ├── app/
│   │   └── [locale]/            # Routage dynamique i18n Next.js
│   │       ├── blog/            # Pages du blog
│   │       │   ├── [slug]/      # Route dynamique de l'article individuel MDX
│   │       │   ├── BlogPageClient.tsx
│   │       │   └── page.tsx     # Serveur index de blog (charge les posts)
│   │       ├── itinerary/       # Page Itinéraire (regroupe Carte et Timeline)
│   │       ├── miam/            # Page de répertoire gastronomique
│   │       ├── photos/          # Galerie photo Masonry filtrable
│   │       ├── layout.tsx       # Layout global injectant polices et providers
│   │       └── page.tsx         # Page d'accueil (composants combinés)
│   ├── components/              # Composants réutilisables
│   │   ├── BlogCard.tsx         # Carte éditoriale
│   │   ├── Footer.tsx           # Pied de page
│   │   ├── Header.tsx           # Navigation bar (avec sélecteurs et menu mobile burger)
│   │   ├── InteractiveMap.tsx   # Carte vectorielle SVG interactive
│   │   ├── Media.tsx            # Composant média unifié (R2 + next/image + vidéo)
│   │   ├── PhotoMasonry.tsx     # Galerie Masonry asymétrique + Lightbox
│   │   ├── ThemeProvider.tsx    # Gestionnaire du Dark Mode (React Context)
│   │   └── Timeline.tsx         # Frise chronologique avec scroll reveal
│   ├── i18n/                    # Configuration et routing next-intl
│   │   ├── routing.ts
│   │   └── request.ts
│   ├── lib/
│   │   └── mdx.ts               # Utilitaire d'extraction de frontmatter MDX
│   └── middleware.ts            # Middleware next-intl pour intercepter la locale
├── next.config.ts               # Configurations Next.js, pageExtensions, next-intl & MDX
└── tailwind.config.ts           # Configurations Tailwind CSS complémentaires
```

---

## ⚙️ Choix d'Architecture Majeurs & Astuces Techniques

### A. Dark Mode sous Tailwind CSS v4
Dans Tailwind CSS v4, le commutateur classique `darkMode: 'class'` de la version 3 n'existe plus.
Pour le faire fonctionner sur la base d'une classe `.dark` appliquée sur l'élément racine `<html>`, nous avons déclaré un variant personnalisé en tête de [src/app/globals.css](file:///d:/Odyssey/our-vietnamese-odyssey/src/app/globals.css) :
```css
@custom-variant dark (&:where(.dark, .dark *));
```
Pour éviter tout **flash blanc** au chargement lorsque le mode sombre est actif (car localStorage est lu côté client), nous injectons un script bloquant synchrone (IIFE) dans le `<head>` du document via [layout.tsx](file:///d:/Odyssey/our-vietnamese-odyssey/src/app/[locale]/layout.tsx) pour ajouter immédiatement la classe `.dark` si nécessaire.

### B. Base de Données Statique, Rendu 100% Statique (SSG) & Localisation (Cloudflare Pages)
Afin d'assurer la compatibilité avec Cloudflare Pages et de contourner définitivement la limite stricte de taille des fonctions serverless (3 Mo) :
1. **Rendu Statique (SSG)** : Le site est configuré en export 100% statique dans [next.config.ts](file:///d:/Odyssey/our-vietnamese-odyssey/next.config.ts) (`output: 'export'`). Cela désactive toutes les fonctions serveurs au runtime : tout le site est compilé sous forme de fichiers HTML statiques dans le dossier `/out`.
2. **Support de Localisation en Statique** : Pour permettre le pré-rendu statique des routes avec `next-intl`, nous avons déclaré la fonction globale `generateStaticParams()` dans le layout racine [layout.tsx](file:///d:/Odyssey/our-vietnamese-odyssey/src/app/[locale]/layout.tsx) pour les locales `fr` et `vi`, et appelé `setRequestLocale(locale)` dans tous les composants serveurs de pages (`layout.tsx`, `page.tsx`, `blog/page.tsx`, `blog/[slug]/page.tsx`).
3. **Extraction de données & Parseur léger** : Le contenu brut des articles est lu depuis l'objet typé [src/data/posts.ts](file:///d:/Odyssey/our-vietnamese-odyssey/src/data/posts.ts) en mémoire et rendu à l'aide d'un parseur Markdown custom léger en React, supprimant ainsi les lourdes dépendances de compilation dynamique de type `next-mdx-remote`.
4. **Stockage des Médias sur Cloudflare R2** : Toutes les images et vidéos du site sont hébergées sur un bucket Cloudflare R2 (`odeysseyr2`) plutôt que dans le dépôt Git. Le composant `Media.tsx` préfixe automatiquement les chemins relatifs avec l'URL publique du bucket (définie dans `.env.local` via `NEXT_PUBLIC_ASSETS_URL`). Un script `npm run upload-r2` (basé sur `@aws-sdk/client-s3`) permet d'uploader récursivement les médias avec détection de doublons via `HeadObject`.
5. **Optimisation des Images** : L'optimisation des images à la volée de Next.js requérant un serveur Node.js actif, elle a été débrayée dans la configuration via `unoptimized: true` pour convenir aux hébergements statiques comme Cloudflare Pages.
6. **Gestion de la Redirection Racine (/)** : L'export statique n'exécutant plus de middleware côté serveur pour rediriger la racine `/` vers `/fr` (langue par défaut), nous avons mis en place un double mécanisme :
   * Une page racine [src/app/page.tsx](file:///d:/Odyssey/our-vietnamese-odyssey/src/app/page.tsx) effectuant une redirection côté client via Next.js.
   * Un fichier de configuration [public/_redirects](file:///d:/Odyssey/our-vietnamese-odyssey/public/_redirects) copié à la racine du dossier de déploiement (`/out/_redirects`) pour indiquer à la couche CDN de Cloudflare Pages d'effectuer une redirection Edge instantanée en code HTTP 302 vers `/fr`.

### C. Gestion des promesses d'API dynamiques (Next.js 15+)
Dans Next.js 15+, les propriétés comme `params` de pages et layouts sont des Promises.
Pour récupérer `locale` ou `slug`, il faut obligatoirement faire :
```typescript
const { locale, slug } = await params;
```
Toute tentative d'accès synchrone (comme un `console.log(params.slug)`) lève une erreur bloquante au runtime.

---

## 📈 Propositions d'Évolutions Futures

Voici les chantiers recommandés pour continuer à enrichir l'application :

### 🌟 1. Interactivité Carte ➔ Timeline
- **Concept** : Actuellement, la carte et la timeline coexistent de façon statique sur la page itinéraire.
- **Évolution** : Lier les deux composants. Un clic sur une ville de la carte SVG fait automatiquement défiler (scroll fluide) l'utilisateur jusqu'à la section correspondante dans la Timeline chronologique, ou inversement, survoler un élément de la timeline illumine le point correspondant sur la carte.

### 🔍 2. Recherche Textuelle Globale & Indexation
- **Concept** : Permettre à l'utilisateur de chercher à la fois dans les recettes de cuisine (Miam), les articles de blog (MDX) et les photos.
- **Évolution** : Créer une barre de recherche globale dans le Header qui s'ouvre en modale (style Spotlight command menu via la touche `Ctrl+K`) pour naviguer instantanément à travers l'Odyssée.

### 🏷️ 3. Filtres Croisés et Tags pour la Galerie Photos
- **Concept** : La galerie filtre actuellement par ville principale.
- **Évolution** : Ajouter un système de tags secondaires (ex : "Famille", "Cuisine", "Nature", "Monuments") sous forme de pilules de filtres croisés avec des transitions animées par Framer Motion (`layoutId` pour des déplacements d'images fluides).

### 💬 4. Zone de Commentaires et Livre d'Or
- **Concept** : Permettre à la famille et aux proches de laisser des messages.
- **Évolution** : Mettre en place une section commentaires en bas de chaque article MDX de blog, connectée à une base de données légère (ex: Supabase, Vercel Postgres, Firebase) ou à un système externe comme Giscus (basé sur les discussions GitHub).

### 📊 5. Optimisations de Production & Performance
- **LCP Images** : Les images imposantes détectées comme LCP (Largest Contentful Paint) par le navigateur gagneraient à recevoir la propriété `priority` (déjà intégrée sur le Hero et les couvertures d'articles de blog).
- **Smooth Scroll** : Gérer l'attribut `data-scroll-behavior="smooth"` au niveau de l'élément racine pour les transitions de route sans à-coups.

---

## 🗓️ Changelog

### 28 Juin 2026 — Migration Médias vers Cloudflare R2

- **Contexte** : Les 17 images du projet (61 Mo) étaient stockées dans `public/images/`, alourdissant le dépôt Git et compliquant les déploiements.
- **Solution** : Migration complète vers un bucket Cloudflare R2 (`odeysseyr2`) avec URL publique.
- **Composant `Media.tsx`** : Remplace `next/image` dans tous les composants. Préfixe automatiquement les chemins relatifs avec `NEXT_PUBLIC_ASSETS_URL`. Supporte les images (via `next/image` + lazy-loading natif) et les vidéos (via balise `<video>` HTML5). Exporte également la fonction utilitaire `assetUrl()` pour les cas où `next/image` n'est pas adapté (ex: masonry layout dans `PhotoMasonry`).
- **Script `upload-to-r2.mjs`** : Upload récursif avec vérification d'existence via `HeadObject` — seul un fichier nouveau ou de taille différente est uploadé. Utilise le SDK `@aws-sdk/client-s3` (compatible API S3 de R2).
- **Credentials** : Fichier `.env.r2` (gitignoré) contenant `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET`. Template dans `.env.r2.example`.
- **Fichiers migrés** : `BlogCard.tsx`, `PhotoMasonry.tsx`, `HomePageClient.tsx`, `blog/[slug]/page.tsx`, `miam/page.tsx`, `photos/page.tsx`, `data/posts.ts`.
- **Résultat** : 17 images sur R2, 0 fichier local, build statique OK, lazy-loading préservé.
