# Aline & Julie · 30 ans — Guide de déploiement

Ton site d'invitation est prêt. Voici comment le mettre en ligne sur **Vercel** (gratuit), avec un **backend partagé** pour que les RSVP, le mur de photos et le livre d'or soient visibles par tout le monde.

Tu peux faire les choses dans cet ordre :

1. Mettre le site en ligne (10 min) — il marche déjà tout seul.
2. Brancher le backend partagé Supabase (15 min) — pour que tout le monde voie les mêmes données.
3. Ajouter tes vraies photos.

---

## 1. Mettre le site en ligne sur Vercel

### Option A — la plus simple (glisser-déposer)

1. Sur ton ordi, ouvre un terminal dans le dossier `aline-julie-30ans` et lance :
   ```bash
   npm install
   npm run build
   ```
   Ça crée un dossier `dist/`.
2. Va sur https://vercel.com → crée un compte (gratuit) avec ton email.
3. Installe l'outil Vercel : `npm i -g vercel`, puis dans le dossier du projet : `vercel`.
   Laisse les réponses par défaut. Vercel te donne une URL du type `https://aline-julie-30ans.vercel.app`.

### Option B — via GitHub (recommandée si tu veux modifier facilement plus tard)

1. Crée un dépôt sur https://github.com et pousse-y le dossier `aline-julie-30ans`.
2. Sur https://vercel.com → **Add New… → Project** → importe ton dépôt GitHub.
3. Vercel détecte tout seul que c'est un projet **Vite**. Clique **Deploy**.

C'est tout — ton site est en ligne. À ce stade il fonctionne déjà, mais les RSVP / photos / messages sont stockés **par appareil** (chacun voit les siens). Passe à l'étape 2 pour les rendre partagés.

---

## 2. Brancher le backend partagé (Supabase)

C'est ce qui permet que **tout le monde voie les mêmes** réponses, photos et messages.

1. Va sur https://supabase.com → crée un compte gratuit → **New project**.
   - Donne un nom (ex. `aline-julie-30ans`), choisis une région en Europe (ex. *West EU / Paris*), et un mot de passe de base de données (note-le quelque part).
2. Une fois le projet créé, ouvre **SQL Editor** (menu de gauche) → **New query**.
3. Ouvre le fichier `supabase_schema.sql` (dans ce dossier), copie tout son contenu, colle-le dans l'éditeur, puis clique **Run**.
   → Ça crée les tables (RSVP, livre d'or, photos) et le stockage des images.
4. Récupère tes 2 clés : menu **Project Settings → API**.
   - **Project URL** → c'est `VITE_SUPABASE_URL`
   - **anon public** (clé publique) → c'est `VITE_SUPABASE_ANON_KEY`
   - ⚠️ N'utilise **jamais** la clé `service_role` ici (elle est secrète).
5. Donne ces 2 clés à Vercel :
   - Sur Vercel → ton projet → **Settings → Environment Variables**.
   - Ajoute :
     - `VITE_SUPABASE_URL` = ton Project URL
     - `VITE_SUPABASE_ANON_KEY` = ta clé anon public
   - Clique **Save**, puis va dans **Deployments → … → Redeploy** pour relancer avec les clés.

Et voilà : RSVP, photos et livre d'or sont maintenant partagés entre tous les invités.

**Où je vois les réponses RSVP ?** Dans Supabase → **Table Editor → rsvps**. (Pour des raisons de confidentialité, les RSVP ne sont lisibles que par toi dans Supabase, pas publiquement sur le site.)

> Note : si tu ne fais pas l'étape 2, le site marche quand même — il garde juste les données localement sur chaque appareil. C'est un filet de sécurité, mais pour un vrai event, fais l'étape 2.

---

## 3. Ajouter tes vraies photos

Les photos vont dans le dossier `public/photos/`. La photo principale (hero) est déjà en place.

Pour remplacer les emplacements « Photo à venir », dépose tes images avec **exactement** ces noms :

| Fichier à déposer        | Où ça s'affiche                         |
|--------------------------|-----------------------------------------|
| `lieu-1.jpg`             | Galerie « Le lieu »                     |
| `lieu-2.jpg`             | Galerie « Le lieu »                     |
| `lieu-3.jpg`             | Galerie « Le lieu »                     |
| `duo-1.jpg` … `duo-5.jpg`| Section « Nous deux » (les polaroids)   |
| `dc-femmes.jpg`          | Dress code — inspiration                |
| `dc-hommes.jpg`          | Dress code — inspiration                |

Conseils : format `.jpg`, idéalement < 1 Mo chacune, orientation portrait pour les polaroids. Si une image manque, un joli cadre « Photo à venir » s'affiche automatiquement (rien ne casse).

Après avoir ajouté les photos : refais `git push` (option B) ou relance `vercel` (option A) pour mettre à jour le site.

> Le **mur de photos en direct** (où les invités ajoutent leurs photos pendant la soirée) fonctionne, lui, via Supabase une fois l'étape 2 faite — pas besoin de toucher aux fichiers.

---

## 4. À personnaliser avant le jour J

Deux infos sont encore des **valeurs provisoires** dans `src/data.js` — pense à les remplacer :

- **`organisersPhone`** : `+33600000000` → mets ton vrai numéro (sert au bouton « Je participe » par SMS).
- **Lien hôtel** : le lien de réservation dans la section infos pratiques pointe vers un lien Booking générique → mets le bon hôtel/lien.

Pour modifier : ouvre `src/data.js`, change les valeurs, sauvegarde, puis redéploie.

---

## Récap des commandes utiles

```bash
npm install        # installe les dépendances
npm run dev        # aperçu en local sur http://localhost:5173
npm run build      # construit le site pour la prod (dossier dist/)
npm run preview    # teste la version de prod en local
```

Des questions ou un blocage ? Reviens me voir, je t'aide à débloquer l'étape concernée. 🎉
