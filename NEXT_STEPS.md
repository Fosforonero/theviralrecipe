# 🚀 TheViralRecipe — Prossimi Step per il Go-Live

Tutto il codice è pronto. Ecco esattamente cosa fare, nell'ordine corretto.

---

## STEP 1 — Push su GitHub (1 minuto)

Apri il Terminale e incolla questo comando (è già in clipboard, premi Cmd+V):

```bash
cd "/Volumes/LOS ANGELES/Matteo/Dev Roba Mia/theviralrecipe" && find .git -name "*.lock" -delete 2>/dev/null; git branch -M main && git push -u origin main
```

Se ti chiede username/password: usa il tuo username GitHub e un Personal Access Token
(GitHub → Settings → Developer settings → Personal access tokens → Generate new token, scope: repo)

---

## STEP 2 — Supabase: API Keys (2 minuti)

1. Vai su → https://supabase.com/dashboard/project/luwqfusexlaydycaptgo/settings/api-keys
2. Copia **"anon public"** → incolla in `.env.local` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Copia **"service_role secret"** → incolla in `.env.local` → `SUPABASE_SERVICE_ROLE_KEY`

---

## STEP 3 — Supabase: Esegui lo Schema SQL (2 minuti)

1. Vai su → https://supabase.com/dashboard/project/luwqfusexlaydycaptgo/sql/new
2. Apri il file `database/schema.sql` (è nella cartella del progetto)
3. Copia tutto il contenuto (Cmd+A, Cmd+C)
4. Incollalo nell'editor SQL di Supabase (Cmd+V)
5. Clicca **"Run"** (o Cmd+Enter)
6. Verifica che non ci siano errori rossi

---

## STEP 4 — Supabase: Storage Bucket (1 minuto)

1. Vai su → https://supabase.com/dashboard/project/luwqfusexlaydycaptgo/storage/buckets
2. Clicca **"New bucket"**
3. Nome: `recipe-images` | ✅ Public bucket
4. Clicca **"Save"**

---

## STEP 5 — Supabase: Google OAuth (3 minuti)

1. Vai su → https://supabase.com/dashboard/project/luwqfusexlaydycaptgo/auth/providers
2. Clicca **Google** → abilita il toggle
3. Segui le istruzioni per creare OAuth Client ID su Google Cloud Console
4. Incolla Client ID e Client Secret

---

## STEP 6 — API Keys varie (10 minuti)

Apri `.env.local` e compila queste chiavi:

| Variabile | Dove trovarla |
|---|---|
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/account/keys |
| `REPLICATE_API_TOKEN` | https://replicate.com/account/api-tokens |
| `YOUTUBE_API_KEY` | https://console.cloud.google.com → Credentials |
| `EDAMAM_APP_ID` + `EDAMAM_APP_KEY` | https://developer.edamam.com/admin |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | https://analytics.google.com → Admin → Data Streams |
| `CRON_SECRET` | Terminale: `openssl rand -base64 32` |

---

## STEP 7 — Stripe: Crea i Prodotti (5 minuti)

1. Vai su → https://dashboard.stripe.com/products/create
2. Crea **"TheViralRecipe Pro"**: ricorrente, **€4,99/mese**, trial 7 giorni
   → Copia il Price ID → `.env.local` → `STRIPE_PRICE_PRO`
3. Crea **"Creator Pro"**: ricorrente, **€19/mese**, trial 14 giorni
   → Copia il Price ID → `.env.local` → `STRIPE_PRICE_CREATOR`
4. Copia le API Keys → https://dashboard.stripe.com/apikeys
5. Configura il Webhook → https://dashboard.stripe.com/webhooks
   - URL endpoint: `https://theviralrecipe.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   → Copia Webhook Secret → `STRIPE_WEBHOOK_SECRET`

---

## STEP 8 — Vercel: Deploy (5 minuti)

1. Vai su → https://vercel.com/new
2. **"Import Git Repository"** → seleziona `Fosforonero/theviralrecipe`
3. Framework: **Next.js** (rilevato automaticamente)
4. Clicca **"Environment Variables"** → aggiungi tutte le variabili da `.env.local`
5. Clicca **"Deploy"**
6. Aspetta 2-3 minuti → sito live su `theviralrecipe.vercel.app`

---

## STEP 9 — DNS Namecheap → Vercel (5 minuti + propagazione)

1. Vercel Dashboard → il tuo progetto → **Settings → Domains**
2. Aggiungi: `theviralrecipe.com` e `www.theviralrecipe.com`
3. Vercel ti mostra i record DNS da aggiungere
4. Vai su → https://ap.www.namecheap.com/domains/list/
5. **Manage** → Advanced DNS → aggiungi i record che Vercel ti indica
6. Aspetta propagazione (5-30 minuti)

---

## STEP 10 — Google AdSense (dopo 50+ ricette)

1. Vai su → https://www.google.com/adsense/
2. Registra `theviralrecipe.com`
3. Copia Publisher ID → `.env.local` → `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`
4. AdSense approva il sito in 1-14 giorni

---

## ✅ Checklist finale

- [ ] STEP 1: Push GitHub
- [ ] STEP 2: API Keys Supabase
- [ ] STEP 3: Schema SQL eseguito
- [ ] STEP 4: Storage bucket creato
- [ ] STEP 5: Google OAuth configurato
- [ ] STEP 6: API Keys compilate in .env.local
- [ ] STEP 7: Stripe prodotti + webhook
- [ ] STEP 8: Deploy Vercel
- [ ] STEP 9: DNS Namecheap
- [ ] STEP 10: AdSense (dopo lancio)

---

## 💰 Stima costi mensili

| Servizio | Costo |
|---|---|
| Vercel Hobby | Gratis |
| Supabase Free | Gratis |
| Claude Haiku (~500 ricette) | ~€0,50 |
| Replicate Flux (~500 img) | ~€1,50 |
| Dominio Namecheap | ~€1/mese |
| **TOTALE** | **~€3/mese** |

Da quando hai 10 abbonati Pro (€4,99) sei già in profitto 🎉
