# 🔍 Debug Upload d'Images en Production

## Symptômes
- ✅ Upload fonctionne en local
- ✅ Image bien enregistrée dans Vercel Blob
- ❌ Erreur côté client en production

## Causes Possibles

### 1. Timeout de Fonction Vercel
- **Hobby Plan** : 10 secondes max par défaut
- **Pro Plan** : Peut aller jusqu'à 60 secondes
- Notre config : `maxDuration = 60`

**Problème potentiel :** Le plan Hobby ne respecte pas `maxDuration > 10`

### 2. Taille du Body de la Requête
- Next.js limite par défaut : 4MB
- Notre config : Aucune limite explicite

### 3. Logs Vercel à Vérifier
Allez dans : **Dashboard → Functions → Choisir `/api/upload` → View Logs**

**Cherchez :**
- Erreurs de timeout (Function execution timed out)
- Erreurs de mémoire
- Erreurs Sharp (traitement d'image)

---

## Solutions à Tester

### Solution 1 : Vérifier le Plan Vercel et ajuster maxDuration

Si vous êtes sur le plan **Hobby**, changez à 10 secondes :
```typescript
export const maxDuration = 10; // au lieu de 60
```

### Solution 2 : Augmenter la limite de Body

Dans `next.config.js`, ajoutez :
```javascript
const nextConfig = {
  // ... config existante
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
```

### Solution 3 : Optimiser le traitement d'images

Réduire la qualité ou la taille avant upload pour accélérer :
```typescript
uploadBuffer = await sharp(Buffer.from(arrayBuffer))
  .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 85 }) // réduit de 90 à 85
  .toBuffer();
```

---

## Action Immédiate

**Vérifiez les logs sur Vercel :**
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur **Functions**
4. Cherchez `/api/upload`
5. Cliquez sur **View Logs**
6. Uploadez une image et regardez le log en temps réel

**Message d'erreur à chercher :**
- `Function execution timed out`
- `Body size exceeded`
- `Error: sharp`
- `BLOB_READ_WRITE_TOKEN`

---

Une fois que vous avez le message d'erreur exact, partagez-le et je pourrai appliquer la correction précise.
