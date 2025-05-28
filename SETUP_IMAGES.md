# Configuration du stockage d'images avec Vercel Blob

## 🚀 Configuration

### 1. Variables d'environnement

Ajoutez cette variable à votre fichier `.env.local` :

```bash
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### 2. Obtenir le token Vercel Blob

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans l'onglet "Storage"
4. Créez un nouveau Blob Store ou utilisez un existant
5. Copiez le token `BLOB_READ_WRITE_TOKEN`

### 3. Configuration en production

Sur Vercel, ajoutez la variable d'environnement :

1. Projet → Settings → Environment Variables
2. Ajoutez `BLOB_READ_WRITE_TOKEN` avec votre token

## 📁 Structure des fichiers uploadés

Les images sont stockées avec cette nomenclature :

- `artwork-{timestamp}-{random}.{extension}` pour les œuvres
- Stockage public avec CDN automatique
- Optimisation automatique des images

## 💰 Coûts Vercel Blob

- **Gratuit** : 1GB de stockage + 1GB de bande passante
- **Pro** : $0.15/GB/mois de stockage + $0.15/GB de bande passante
- **Enterprise** : Tarifs personnalisés

## 🔄 Alternatives

Si vous préférez une autre solution :

### Cloudinary (Recommandé pour les galeries)

```bash
npm install cloudinary
```

### AWS S3

```bash
npm install @aws-sdk/client-s3
```

### Supabase Storage

```bash
npm install @supabase/supabase-js
```

## 🛠️ Fonctionnalités implémentées

- ✅ Upload direct de fichiers
- ✅ Saisie manuelle d'URL
- ✅ Upload multiple pour les événements
- ✅ Validation des types de fichiers
- ✅ Limitation de taille (10MB max)
- ✅ Aperçu des images
- ✅ Suppression d'images
- ✅ Interface drag & drop

## 🔧 Utilisation

### Pour une image unique (œuvres)

```tsx
import { ImageUpload } from "@/components/ui/image-upload";

<ImageUpload
  value={imageUrl}
  onChange={setImageUrl}
  label="Image de l'œuvre"
  required
/>;
```

### Pour plusieurs images (événements)

```tsx
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";

<MultipleImageUpload
  values={imageUrls}
  onChange={setImageUrls}
  label="Images de l'événement"
  maxImages={10}
/>;
```
