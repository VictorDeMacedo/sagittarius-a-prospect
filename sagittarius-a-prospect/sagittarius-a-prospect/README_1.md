# ProspectImmo France - Vraie App Prod
Orléans 30km + Loiret Pro + France entière

## C'est quoi ce dossier ?
C'est la VRAIE application, pas une maquette HTML. Tu as :
- /app : Next.js 14 App Router (dashboard, zones, pige)
- /supabase/functions : 2 Edge Functions prêtes (leboncoin-direct + seloger-direct)
- /lib : connexion Supabase

## Déploiement réel en 5 minutes

### 1. Supabase (2 min)
- Va sur supabase.com > New Project > Region EU West (Paris)
- Va dans SQL Editor > colle le contenu de schema_v4_france.sql (dans /mnt/data)
- Va dans Project Settings > API > copie URL + ANON_KEY + SERVICE_ROLE_KEY

### 2. Edge Function LeBonCoin Direct (1 min)
```bash
npm install -g supabase
supabase login
supabase link --project-ref TON_PROJECT_ID
supabase functions deploy leboncoin-direct --no-verify-jwt
supabase functions deploy seloger-direct --no-verify-jwt
```

### 3. Frontend Vercel (2 min)
- Va sur vercel.com > Add New Project > Import ce dossier GitHub
- Ajoute les variables d'environnement:
  NEXT_PUBLIC_SUPABASE_URL=...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
  SUPABASE_SERVICE_ROLE_KEY=...
- Deploy

C'est en ligne. Pas de HTML factice, c'est une vraie SaaS.

### Option C - GitHub Actions gratuit pour scraper (tu as un compte payant)
Le fichier .github/workflows/scrape.yml lance tous les jours à 6h le scraping Orléans + Loiret et pousse dans Supabase. 0€ Apify.

### Test local
```bash
npm install
npm run dev
# http://localhost:3000
```

Tu verras ton dashboard Orléans 30km avec tes zones.
