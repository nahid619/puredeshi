# Pure Deshi — Website Project

This is the real codebase for the Pure Deshi website, being built in phases.
**This delivery is cumulative Phases 1–2: Infrastructure + Data Layer & Auth.**

If you've never run a Next.js project before, follow every step below exactly
— don't skip anything, even if it looks obvious.

---

## What's in this delivery

**From Phase 1 (infrastructure):**
- A working Next.js project with the brand colors and fonts (Baloo Da 2 / Hind Siliguri)
- The real Pure Deshi logo
- Connection helpers for MongoDB Atlas and Cloudinary

**New in Phase 2 (data layer & auth):**
- The real database structure: Product, Category, Combo, Banner, Settings, Admin, ClickLog
- A one-command **seed script** that fills your database with the real 13-product
  catalog, 4 categories, and 1 combo from the project spec
- Working API routes to create/read/update/delete every type of content (the
  same routes the real admin panel will use in Phase 3)
- Admin login — username/password, securely hashed, session-based

There's still no real public website or admin panel UI yet — this phase is
about making sure the data and login *work correctly* underneath. You'll test
that today using three status panels on the placeholder homepage.

---

## Step-by-step: how to run this on your computer

### 1. Install Node.js (skip if already done)
Download the **LTS** version from https://nodejs.org and install it like any
normal program.

### 2. Unzip this project
Unzip the file anywhere on your computer (e.g. your Desktop). You should see
a folder called `pure-deshi`.

### 3. Open a terminal in that folder
- **Windows:** open the `pure-deshi` folder in File Explorer, click the
  address bar, type `cmd`, press Enter.
- **Mac:** open Terminal, type `cd ` (with a space), then drag the
  `pure-deshi` folder into the terminal window, press Enter.

### 4. Install the project's dependencies
```
npm install
```
(Takes a minute or two. Only needed once — or again later if you re-download a newer ZIP.)

### 5. Set up your environment file
If you already have a `.env.local` file from before (with your MongoDB Atlas
connection string), keep using it — just open it and add **three new lines**
at the bottom if they're not already there:
```
AUTH_SECRET=
ADMIN_USERNAME=
ADMIN_PASSWORD=
```
- `AUTH_SECRET` — any random string of 32+ characters. If you have a Mac/Linux
  terminal or Git Bash, you can generate one with `openssl rand -base64 32`.
  Otherwise just mash the keyboard for 32+ characters — it just needs to be
  unique and secret.
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — pick whatever you want to log into the
  admin panel with later. This is **your** login, not mine — keep it private.

If you're starting completely fresh, copy `.env.example` to `.env.local` and
fill in everything (MongoDB Atlas connection string included).

### 6. Populate your database with the real catalog
This is new in Phase 2 — it only needs to be run once (but is safe to re-run):
```
npm run seed
```
You should see it print out each of the 4 categories and 13 products as it
creates them, ending with "✅ Seeding complete."

If you see an error instead, it's almost always one of:
- `MONGODB_URI is not set` → check step 5 above
- A connection timeout → check your MongoDB Atlas "Network Access" allows
  connections from anywhere (`0.0.0.0/0`)

### 7. Start the project
```
npm run dev
```

### 8. Open it in your browser
Go to **http://localhost:3000**. You should see the logo, a
"PHASE 2 — DATA LAYER & AUTH" badge, and **three** status panels:

1. **Setup Status** — green dots for MongoDB Atlas and Cloudinary (from Phase 1)
2. **Admin Login Test** — log in with the `ADMIN_USERNAME` / `ADMIN_PASSWORD`
   you set in step 5 (and used when running `npm run seed`). You should see
   "✅ Logged in as ..." and a Log out button.
3. **Catalog Data Test** — should show **4 categories · 13 products · 1 combo**.
   Try the **"+ Add test category"** button — it should succeed only while
   you're logged in (try it logged out first — it should clearly say it
   failed because you're not logged in, then log in and try again).

If all three panels work as described, **Phase 2 works correctly.** ✅

---

## Project structure (for reference)

```
pure-deshi/
├── app/
│   ├── page.js                  ← placeholder homepage with the 3 test panels
│   ├── layout.js                ← brand fonts
│   ├── globals.css              ← brand colors
│   └── api/
│       ├── health/route.js      ← Phase 1: Mongo/Cloudinary connection check
│       ├── auth/                ← login / logout / me (session check)
│       ├── products/            ← GET (public), POST (admin) + [id] for PUT/DELETE
│       ├── categories/          ← same pattern as products
│       ├── combos/              ← same pattern as products
│       ├── banners/             ← same pattern as products
│       └── settings/            ← singleton settings document (WhatsApp number, etc.)
├── components/
│   ├── SetupStatus.js           ← Phase 1 status card
│   ├── AdminLoginPanel.js       ← Phase 2 login test card
│   └── CatalogPreview.js        ← Phase 2 catalog test card
├── lib/
│   ├── mongodb.js               ← database connection helper
│   ├── cloudinary.js            ← Cloudinary SDK config
│   └── auth.js                  ← session creation/verification (signed cookie)
├── models/                      ← Product, Category, Combo, Banner, Settings, Admin, ClickLog
├── scripts/seed.mjs             ← one-command catalog + admin seeding
├── public/images/               ← logo files
├── .env.example                 ← template — copy to .env.local and fill in
└── package.json
```

---

## What's next (Phase 3)

Once you confirm all three panels above work, Phase 3 builds the **real admin
panel** — the actual screens (matching the admin mockup you sent) for managing
products, categories, combos, banners, and settings, including real Cloudinary
image uploads. The test panels on the homepage will be removed once the real
admin panel replaces them.

Just send the next message whenever you're ready, and let me know if any
step above didn't work as described.
