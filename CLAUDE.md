# CLAUDE.md - Projet "Our Vietnamese Odyssey"

Ce fichier fournit les informations essentielles à **Claude Code** (ou tout autre agent IA) pour exécuter et développer le projet.

## 🛠️ Commandes de Base
* **Démarrer le serveur de développement** :
  ```powershell
  $env:PATH += ";C:\Program Files\nodejs"; npm run dev
  ```
* **Compiler le projet (export statique SSG)** :
  ```powershell
  $env:PATH += ";C:\Program Files\nodejs"; npm run build
  ```
* **Linter le code** :
  ```powershell
  $env:PATH += ";C:\Program Files\nodejs"; npm run lint
  ```

## 📐 Architecture et Contraintes
1. **Export Statique (SSG)** : Le projet utilise `output: 'export'` dans `next.config.ts`. Tout le site compile dans le dossier `/out/`.
2. **Optimisation Taille (Cloudflare Pages)** :
   * Ne **pas** utiliser de modules Node.js natifs (`fs`, `path`) dans les pages au runtime.
   * Pas de bibliothèque de compilation MDX dynamique lourde (`next-mdx-remote`) qui dépasse les 3 Mo de quota Cloudflare.
   * Les articles de blog sont chargés statiquement en mémoire depuis [src/data/posts.ts](file:///d:/Odyssey/our-vietnamese-odyssey/src/data/posts.ts) et rendus à l'aide d'un parseur Markdown custom ultra-léger en React dans [src/app/[locale]/blog/[slug]/page.tsx](file:///d:/Odyssey/our-vietnamese-odyssey/src/app/[locale]/blog/[slug]/page.tsx).
3. **Localisation (next-intl)** :
   * Toujours appeler `setRequestLocale(locale)` en haut de chaque composant de page serveur (`layout.tsx`, `page.tsx`, `blog/page.tsx`, `blog/[slug]/page.tsx`) pour figer la locale au moment du build.
   * La redirection de la racine `/` vers `/fr` est gérée à la fois par [src/app/page.tsx](file:///d:/Odyssey/our-vietnamese-odyssey/src/app/page.tsx) (redirection client) et [public/_redirects](file:///d:/Odyssey/our-vietnamese-odyssey/public/_redirects) (redirection Edge Cloudflare Pages).
4. **Design System** : Style éditorial haut de gamme basé sur une palette pastel définie dans `tailwind.config.ts`, avec support natif du mode sombre (via la classe `.dark`).

Pour un historique complet et détaillé du développement, des choix techniques et des évolutions suggérées, veuillez vous référer à :
👉 **[development_history.md](file:///d:/Odyssey/our-vietnamese-odyssey/development_history.md)**
