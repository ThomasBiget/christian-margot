# 🚀 Configuration Vercel Blob pour la Production

## 📝 Étapes pour obtenir votre Token Vercel Blob

### 1. Se connecter à Vercel Dashboard

Allez sur : **https://vercel.com/dashboard**

### 2. Créer un Blob Store (si ce n'est pas déjà fait)

1. Dans votre projet, allez dans l'onglet **Storage**
2. Cliquez sur **Create Database**
3. Sélectionnez **Blob** (Vercel Blob)
4. Donnez-lui un nom (ex: `christian-margot-images`)
5. Cliquez sur **Create**

### 3. Créer un Token

1. Une fois le Blob Store créé, allez dans **Settings** du store
2. Ou allez directement dans **Storage → Blob → [Votre Store]**
3. Dans l'onglet **Tokens**, cliquez sur **Create Token**
4. Sélectionnez les permissions :
   - ✅ **Read** (lecture)
   - ✅ **Write** (écriture)
5. Cliquez sur **Create**
6. **COPIEZ LE TOKEN** (il commence par `vercel_blob_rw_...`)
   ⚠️ Vous ne pourrez le voir qu'une seule fois !

### 4. Le token ressemble à ceci :

```
vercel_blob_rw_XXXXXXXXXXXXXXX_YYYYYYYYYYYYYYYYY
```

## ⚡ Configuration Rapide

Après avoir copié votre token, je vais vous aider à :
1. L'ajouter à votre fichier `.env`
2. Tester que l'upload fonctionne
3. Configurer les variables sur Vercel
4. Déployer en production

---

**Une fois que vous avez le token, collez-le dans le chat et je configurerai tout automatiquement !**

Ou si vous préférez le faire manuellement :

```bash
# Ajoutez cette ligne à votre fichier .env
echo 'BLOB_READ_WRITE_TOKEN="VOTRE_TOKEN_ICI"' >> .env
```
