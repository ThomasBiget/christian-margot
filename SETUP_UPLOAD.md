# 📤 Configuration de l'Upload d'Images

## 🔴 Problème Actuel

L'erreur "Erreur lors de l'upload de l'image" se produit car la variable d'environnement `BLOB_READ_WRITE_TOKEN` n'est pas configurée.

## ✅ Solution 1 : Utiliser Vercel Blob (Recommandé pour Production)

### Étape 1 : Créer un Token Vercel Blob

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Storage** → **Blob**
4. Cliquez sur **Create Store** (si vous n'en avez pas)
5. Allez dans **Tokens** → **Create Token**
6. Copiez le token généré (commence par `vercel_blob_rw_...`)

### Étape 2 : Ajouter le Token à votre .env

Ajoutez cette ligne à votre fichier `.env` :

```env
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_XXXXXXXXXXXXX"
```

### Étape 3 : Redémarrer le Serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

## 🛠️ Solution 2 : Stockage Local (pour Développement)

Si vous préférez ne pas utiliser Vercel Blob en développement, utilisez le stockage local :

### Créer une Alternative Locale

Cette solution stocke les images dans `/public/uploads` en développement.

**Avantages :**
- ✅ Pas besoin de token Vercel
- ✅ Images accessibles immédiatement
- ✅ Gratuit et illimité en local

**Inconvénients :**
- ⚠️ Images perdues lors du déploiement Vercel (stockage éphémère)
- ⚠️ Nécessite Vercel Blob en production

Je peux créer cette alternative si vous le souhaitez.

## 🌐 Configuration pour la Production

Sur Vercel, ajoutez la variable d'environnement :

1. Allez dans **Project Settings** → **Environment Variables**
2. Ajoutez :
   - **Name:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** `vercel_blob_rw_XXXXXXXXXXXXX` (votre token)
   - **Environments:** Production, Preview, Development

## 🧪 Tester l'Upload

1. Démarrez le serveur : `npm run dev`
2. Allez dans `/admin/login`
3. Créez un nouvel événement
4. Uploadez une image

Si vous voyez toujours l'erreur, vérifiez les logs du terminal pour plus de détails.

## 📝 Vérification

Pour vérifier que le token est bien chargé :

```bash
# Dans le terminal, pendant que le serveur tourne
node -e "console.log(process.env.BLOB_READ_WRITE_TOKEN ? '✅ Token configuré' : '❌ Token manquant')"
```

## 🆘 Dépannage

### Erreur : "Configuration du stockage d'images manquante"
→ Le token n'est pas dans le fichier `.env` ou le serveur n'a pas été redémarré

### Erreur : "Upload failed" ou "Unauthorized"
→ Le token est invalide ou expiré. Créez un nouveau token sur Vercel

### Erreur : "Sharp module not found"
→ Réinstallez les dépendances : `npm install`

---

**Créé le :** 30 septembre 2025  
**Dernière mise à jour :** 30 septembre 2025
