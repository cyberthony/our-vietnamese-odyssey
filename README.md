# Our Vietnamese Odyssey 🌸✈️

**Our Vietnamese Odyssey** est un carnet de voyage et album photo familial premium et moderne documentant un périple familial de 40 jours entre la Corée du Sud et le Vietnam. Il est conçu sous forme de journal de bord et album intemporel, stylisé de façon épurée, fluide et haut de gamme.

---

## 🌟 Caractéristiques Principales
* **Internationalisation (i18n)** : Support complet du Français (`fr`) et du Vietnamien (`vi`) avec bascule instantanée sans rechargement lourd.
* **Redirection Edge** : Redirection automatique de la racine `/` vers `/fr` gérée par la couche Edge du CDN.
* **Design Éditorial Premium** : Mise en page inspirée des magazines de voyage de luxe, avec transitions d'interfaces fluides et support natif du **Mode Sombre** (sans effet de flash blanc).
* **Album Photo Masonry** : Galerie fluide dynamique avec filtres et visionneuse (lightbox) intégrée.
* **Journal Intime (Blog)** : Articles rédigés au format Markdown, compilés de façon ultra-optimisée pour un chargement instantané.
* **Déploiement 100 % Statique (SSG)** : Compilé en fichiers HTML plats pour des temps de chargement records et hébergé sans serveur sur Cloudflare Pages.

---

## 🛠️ Stack Technique
* **Framework** : Next.js 16 (App Router)
* **Styling** : Tailwind CSS
* **Animations** : Framer Motion
* **Internationalisation** : `next-intl` (mode SSG)
* **Hébergement** : Cloudflare Pages (dossier de build `/out`)

---

## 🚀 Démarrage Rapide

### 1. Cloner le projet et installer les dépendances
```bash
git clone https://github.com/cyberthony/our-vietnamese-odyssey.git
cd our-vietnamese-odyssey
npm install
```

### 2. Lancer en local
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 3. Compiler pour la production
```bash
npm run build
```
Les fichiers générés sont placés dans le dossier `/out`.

---

## 📐 Architecture et Reprise de Projet

Si vous êtes un développeur ou une intelligence artificielle (comme Claude Code) reprenant le développement de ce projet, veuillez consulter les guides détaillés suivants :
1. **[CLAUDE.md](file:///d:/Odyssey/our-vietnamese-odyssey/CLAUDE.md)** : Raccourcis de commandes et contraintes du runtime pour l'IA.
2. **[development_history.md](file:///d:/Odyssey/our-vietnamese-odyssey/development_history.md)** : Journal de bord de l'architecture du projet, historique des choix technologiques (moteur Markdown, mode sombre, i18n statique) et pistes d'évolutions recommandées.
