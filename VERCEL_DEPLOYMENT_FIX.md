# 🚀 Résolution des Erreurs de Déploiement Vercel

## 🔍 Problème Identifié

Erreur lors du build : `FATAL: Tenant or user not found`

Cette erreur se produit car les pages Next.js tentent de se générer statiquement pendant le build et font des requêtes à la base de données qui n'est pas accessible ou mal configurée.

## ✅ Solutions Appliquées

### 1. Gestion d'Erreur dans les Fonctions de Base de Données

Ajout de blocs `try/catch` dans toutes les fonctions de lecture de `src/lib/event.ts` :
- `getAllEvents()` → Retourne `[]` si erreur
- `getUpcomingEvents()` → Retourne `[]` si erreur
- `getPastEvents()` → Retourne `[]` si erreur
- `getEventById()` → Retourne `null` si erreur
- `getFeaturedEvents()` → Retourne `[]` si erreur

Cette approche est similaire à celle déjà en place dans `src/lib/artwork.ts`.

### 2. Configuration Dynamic Rendering

Ajout de `export const dynamic = 'force-dynamic'` dans :
- `/src/app/evenements/page.tsx`
- `/src/app/evenements/[id]/page.tsx`

Cela empêche Next.js de tenter une génération statique pendant le build.

## 🔧 Actions Requises sur Vercel

### Configuration des Variables d'Environnement

Assurez-vous que les variables suivantes sont configurées dans **Vercel → Settings → Environment Variables** :

#### Variables Requises

1. **`DATABASE_URL`**
   - URL de connexion à votre base de données PostgreSQL
   - Format : `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require`
   - ⚠️ **Important** : Doit être accessible depuis Vercel

2. **`BLOB_READ_WRITE_TOKEN`**
   - Token Vercel Blob pour l'upload d'images
   - Obtenu via : Vercel Dashboard → Storage → Blob → Tokens

3. **`NEXTAUTH_URL`**
   - URL de votre site en production
   - Exemple : `https://votre-site.vercel.app`

4. **`NEXTAUTH_SECRET`**
   - Secret pour NextAuth (générer avec : `openssl rand -base64 32`)

5. **`ADMIN_EMAIL`** et **`ADMIN_PASSWORD`** (si utilisé)
   - Credentials admin pour accès au back-office

### Vérifications Base de Données

#### Option 1 : Base de Données Externe (recommandé)

Si vous utilisez une base PostgreSQL externe (Supabase, Neon, etc.) :

1. ✅ Vérifiez que l'IP de Vercel est whitelistée
2. ✅ Assurez-vous que la connexion SSL est activée
3. ✅ Testez la connexion avec la `DATABASE_URL` fournie

#### Option 2 : Vercel Postgres

Si vous utilisez Vercel Postgres :

1. Créez une base Vercel Postgres dans votre projet
2. La variable `POSTGRES_PRISMA_URL` sera automatiquement créée
3. Mettez à jour `DATABASE_URL` pour utiliser `POSTGRES_PRISMA_URL`

### Déploiement des Migrations Prisma

Après avoir configuré les variables d'environnement :

```bash
# Depuis votre terminal local
npm run build

# Ou forcer un redéploiement sur Vercel
git commit --allow-empty -m "Trigger Vercel rebuild"
git push
```

Vercel exécutera automatiquement `prisma generate` grâce au script `postinstall` dans `package.json`.

## 📊 Comportement en Production

### Avec Base de Données Accessible
- ✅ Les pages affichent les données en temps réel
- ✅ Les événements sont chargés dynamiquement
- ✅ Les images s'uploadent vers Vercel Blob

### Sans Base de Données (Build Time)
- ✅ Le build réussit quand même (grâce aux `try/catch`)
- ⚠️ Les pages d'événements affichent "Aucun événement"
- ⚠️ La page d'accueil utilise les données mock des œuvres

## 🧪 Test Local

Pour tester le comportement sans base de données :

```bash
# Commenter temporairement DATABASE_URL dans .env
# DATABASE_URL="..."

npm run build
npm start
```

Vous devriez voir des avertissements dans les logs, mais le site doit se charger.

## 📝 Fichiers Modifiés

- ✅ `src/lib/event.ts` - Ajout gestion d'erreur
- ✅ `src/app/evenements/page.tsx` - Ajout dynamic rendering
- ✅ `src/app/evenements/[id]/page.tsx` - Ajout dynamic rendering
- ✅ `src/app/api/upload/route.ts` - Support HEIC + vérification token
- ✅ `src/components/admin/edit-event-form.tsx` - Upload moderne + dates début/fin
- ✅ `src/components/ui/image-upload.tsx` - Support HEIC
- ✅ `src/components/ui/multiple-image-upload.tsx` - Support HEIC

## 🎯 Prochaines Étapes

1. ✅ Configurer toutes les variables d'environnement sur Vercel
2. ✅ Vérifier la connexion à la base de données
3. ✅ Pousser le code avec les corrections
4. ✅ Attendre le déploiement Vercel
5. ✅ Tester les fonctionnalités d'upload d'images
6. ✅ Tester la création/édition d'événements

## 📞 Support

Si le problème persiste :
1. Vérifiez les logs Vercel : `Functions` → Sélectionner la fonction → `Logs`
2. Vérifiez que `DATABASE_URL` est bien définie
3. Testez la connexion DB depuis un client externe (pgAdmin, TablePlus, etc.)

---

**Date de création** : 30 septembre 2025
**Statut** : ✅ Corrections appliquées, prêt pour le déploiement
