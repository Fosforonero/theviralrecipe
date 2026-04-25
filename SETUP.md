# TheViralRecipe — Guida Setup Completo

## 1. PREREQUISITI

- Node.js 20+
- Account Supabase (piano free va bene per iniziare)
- Account Vercel (piano Hobby)
- Account Stripe (per pagamenti)
- API key Anthropic (Claude)
- API key Google (YouTube Data API v3)
- Account Replicate (per immagini AI)
- Dominio su Namecheap: theviralrecipe.com

---

## 2. SUPABASE — SETUP DATABASE

1. Vai su [supabase.com](https://supabase.com) → crea un nuovo progetto
2. In **SQL Editor** → incolla ed esegui `database/schema.sql`
3. In **Storage** → crea bucket `recipe-images` (Public)
4. In **Auth** → Settings → abilita provider **Google** (OAuth)
5. Copia le API keys: Settings → API

---

## 3. VERCEL — DEPLOY

```bash
# 1. Installa Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Collega il repo GitHub (crea repo prima)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/theviralrecipe.git
git push -u origin main

# 4. Deploy su Vercel
vercel --prod
```

### Environment Variables su Vercel
In Vercel Dashboard → Settings → Environment Variables, aggiungi tutte le variabili da `.env.example`

---

## 4. DNS NAMECHEAP → VERCEL

1. Vercel Dashboard → il tuo progetto → Settings → Domains → Add: `theviralrecipe.com`
2. Vercel ti darà due record DNS
3. Su Namecheap → Domain List → Manage → Advanced DNS:
   - Aggiungi record **A**: Host `@`, Value = IP Vercel
   - Aggiungi record **CNAME**: Host `www`, Value = `cname.vercel-dns.com`
4. Aspetta propagazione (5-30 min)

---

## 5. STRIPE — SETUP PAGAMENTI

1. Crea prodotti su [stripe.com](https://stripe.com):
   - **TheViralRecipe Pro**: ricorrente, 4,99€/mese, 7 giorni trial
   - **Creator Pro**: ricorrente, 19€/mese, 14 giorni trial
2. Copia i **Price ID** (es. `price_xxx`) in `.env.local`
3. Webhook: Stripe Dashboard → Developers → Webhooks → Add endpoint:
   - URL: `https://theviralrecipe.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copia il **Webhook Secret** in `.env.local`

---

## 6. API KEYS

### YouTube Data API v3 (gratis)
1. [console.cloud.google.com](https://console.cloud.google.com)
2. Crea progetto → Abilita "YouTube Data API v3"
3. Credentials → Create API Key
4. Quotas: 10.000 unità/giorno (gratis) — ogni search = 100 unità

### Replicate (immagini AI)
1. [replicate.com](https://replicate.com) → API tokens
2. Primo $5 gratuiti → poi $0.003/immagine con Flux Schnell

### Edamam (valori nutrizionali)
1. [developer.edamam.com](https://developer.edamam.com)
2. Piano free: 10.000 chiamate/mese

### Claude API (Anthropic)
1. [console.anthropic.com](https://console.anthropic.com)
2. Usa modello `claude-haiku-4-5-20251001` per la pipeline (economico)

---

## 7. PRIMO AVVIO

```bash
# Installa dipendenze
npm install

# Avvia in sviluppo
npm run dev

# Apri: http://localhost:3000/it
```

### Testa la pipeline manualmente:
```
GET http://localhost:3000/api/cron/discover
Authorization: Bearer [CRON_SECRET]
```

---

## 8. STRUTTURA DEL PROGETTO

```
theviralrecipe/
├── database/
│   └── schema.sql              ← Schema Supabase completo
├── messages/
│   ├── it.json                 ← Traduzioni italiano
│   └── en.json                 ← Traduzioni inglese
├── src/
│   ├── app/
│   │   ├── [locale]/           ← Tutte le pagine pubbliche
│   │   │   ├── page.tsx        ← Home
│   │   │   ├── ricette/[slug]  ← Singola ricetta
│   │   │   ├── classifica/     ← Classifica
│   │   │   ├── categorie/      ← Categorie
│   │   │   ├── profilo/        ← Area utente
│   │   │   └── pro/            ← Pagina Pro
│   │   ├── admin/              ← Dashboard admin
│   │   ├── api/
│   │   │   ├── cron/           ← Vercel Cron Jobs
│   │   │   ├── stripe/         ← Pagamenti
│   │   │   └── admin/          ← API admin
│   │   ├── og/                 ← OG images dinamiche
│   │   ├── sitemap.ts          ← Sitemap SEO
│   │   └── robots.ts
│   ├── components/
│   │   ├── recipe/             ← RecipeCard, VoteButton, ecc.
│   │   └── layout/             ← Header, Footer
│   ├── i18n/                   ← Configurazione next-intl
│   └── lib/
│       ├── supabase/           ← Client browser e server
│       ├── pipeline/           ← Tutta la pipeline automatica
│       └── utils.ts            ← Helper functions
├── .env.example                ← Template variabili d'ambiente
├── next.config.mjs
├── tailwind.config.ts
└── vercel.json                 ← Cron Jobs
```

---

## 9. COSTI STIMATI A REGIME

| Servizio | Piano | Costo |
|---|---|---|
| Vercel | Hobby (gratis) o Pro ($20/mo) | $0-20/mo |
| Supabase | Free (fino a 500MB) | $0-25/mo |
| Claude Haiku | ~500 ricette/mese | ~$0.50/mo |
| Replicate Flux | ~500 immagini/mese | ~$1.50/mo |
| Edamam | Free (10k/mo) | $0/mo |
| YouTube API | Free (10k unità/giorno) | $0/mo |
| Stripe | 1.4% + €0.25 per transazione | variabile |
| **TOTALE** | | **~$2-45/mo** |

---

## 10. PROSSIMI STEP

- [ ] Installare `@anthropic-ai/sdk` (`npm install @anthropic-ai/sdk`)
- [ ] Configurare Supabase Auth con Google OAuth
- [ ] Aggiungere `Toaster` wrapper (già in layout)
- [ ] Generare tipi TypeScript Supabase: `npm run supabase:types`
- [ ] Configurare Sentry per error tracking (opzionale)
- [ ] Integrare Google AdSense (dopo 50+ ricette pubblicate)
- [ ] Configurare Amazon Affiliate links negli ingredienti
