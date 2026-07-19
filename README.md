# FasoConnect

FasoConnect est une plateforme de traduction et de synthèse vocale dédiée aux langues locales du Burkina Faso et de l'Afrique de l'Ouest.

## Fonctionnalités
- **Traduction textuelle** : Traduisez entre les langues internationales (Français, Anglais) et les langues locales (Mooré, Dioula, Fulfuldé, etc.).
- **Synthèse vocale (TTS)** : Écoutez les traductions avec des voix authentiques pour les langues locales.
- **Traduire et Parler** : Mode combiné pour traduire et générer l'audio en une seule étape.
- **Historique** : Retrouvez vos dernières traductions et lectures (stockées localement).
- **Responsive** : Design adapté pour desktop, tablette et mobile.

## Prérequis
- Node.js 18+ (20+ recommandé)
- npm ou bun

## Configuration
1. Copiez le fichier `.env.example` en `.env.local`
2. Configurez les variables d'environnement nécessaires :

```env
# URL de base pour l'API backend FasoConnect (obligatoire en prod)
NEXT_PUBLIC_API_BASE_URL="https://api.votre-domaine.com"

# Autres variables éventuelles...
```

## Scripts
- `npm run dev` : Démarre le serveur de développement sur le port 3000.
- `npm run build` : Compile l'application en mode statique pour la production.
- `npm run lint` : Vérifie la qualité du code avec ESLint.

## Technologies
- Next.js 15 (App Router - Mode Static Export)
- React 19
- Tailwind CSS v4
- Lucide React (Icônes)

## Déploiement Continu sur GitHub Pages

Le projet est configuré pour être déployé automatiquement sur GitHub Pages via GitHub Actions lors d'un push sur la branche `main`. L'application utilise l'export statique (`output: 'export'`) de Next.js.

### Configuration initiale sur GitHub :

1. Allez dans les paramètres de votre repository GitHub (**Settings** > **Pages**).
2. Dans la section **Build and deployment**, sous **Source**, sélectionnez **GitHub Actions**.
3. Allez dans **Settings** > **Secrets and variables** > **Actions**.
4. Cliquez sur **New repository secret** et ajoutez le secret suivant :
   - **Name** : `NEXT_PUBLIC_API_BASE_URL`
   - **Secret** : *(L'URL de base de votre API FasoConnect pour permettre à l'app de communiquer avec le backend)*
5. Poussez votre code sur la branche `main` pour déclencher le premier déploiement.

*Note : Le fichier `next.config.ts` gère automatiquement le `basePath` et le `assetPrefix` selon le nom de votre repository.*
