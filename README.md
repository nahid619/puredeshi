# Pure Deshi — Website Project

This is the real codebase for the Pure Deshi website, being built in phases.
**This delivery is cumulative Phases 1–3: Infrastructure + Data Layer/Auth + Admin Panel.**

If you've never run a Next.js project before, follow every step below exactly
— don't skip anything, even if it looks obvious.

---

## What's in this delivery

**From Phase 1 (infrastructure):** Next.js project, brand fonts/colors, logo,
MongoDB/Cloudinary connection helpers.

**From Phase 2 (data layer & auth):** Database structure (Product, Category,
Combo, Banner, Settings, Admin, ClickLog), the `npm run seed` script, working
API routes, admin login.

**New in Phase 3 — the real admin panel** at `/admin`:
- A proper sidebar + login screen, matching the admin mockup you sent
- **Products tab** — search/filter, table, add/edit form with a live preview
  card that updates as you type, real Cloudinary image upload, stock and
  "featured" toggles, star-to-feature shortcut right in the table
- **Categories tab** — add/edit/delete, shows how many products use each one
- **Combos tab** — bundle multiple products together with a combo price
- **Banners tab** — upload homepage banner images, set links, reorder with
  up/down arrows
- **Settings tab** — WhatsApp number, order message templates, Facebook link
- **Dashboard tab** — total products, stock-out count, and (once the public
  site is live in Phase 4) order-click stats

The homepage placeholder is now just a single "Go to Admin Panel" button —
the old test panels from Phase 1/2 have been retired since the real thing now
exists.

---

## Step-by-step: how to run this on your computer

### 1. Install Node.js (skip if already done)
Download the **LTS** version from https://nodejs.org and install it.

### 2. Unzip this project and open a terminal in it
Same as before — unzip the folder, then open a terminal/Command Prompt
inside the `pure-deshi` folder.

### 3. Install dependencies
```
npm install
```

### 4. Check your `.env.local`
If you've been following along, you should already have one with your
MongoDB Atlas connection string and the `AUTH_SECRET` / `ADMIN_USERNAME` /
`ADMIN_PASSWORD` from Phase 2. Nothing new is required for Phase 3 — the
same Cloudinary credentials from Phase 1 now actually get used for real
image uploads.

### 5. Make sure your database is seeded
If you haven't already:
```
npm run seed
```

### 6. Start the project
```
npm run dev
```

### 7. Try the real admin panel
Go to **http://localhost:3000** and click **"অ্যাডমিন প্যানেলে যান"**, or go
directly to `http://localhost:3000/admin/login`.

Log in with your `ADMIN_USERNAME` / `ADMIN_PASSWORD`. You should land on the
**Dashboard** with your real product count.

**Things worth specifically testing:**
- **Products** — click "নতুন প্রোডাক্ট", fill in a name, price, upload a real
  photo from your computer, and watch the live preview card on the right
  update as you type. Save it, then find it in the table. Click the star
  icon to feature it. Edit it. Delete it.
- **Categories** — add a new one, check the icon name field links to
  tabler.io/icons for browsing icon names.
- **Combos** — create a combo from 2–3 existing products with a discounted
  bundle price.
- **Banners** — upload an image, reorder it with the up/down arrows.
- **Settings** — change the WhatsApp number, save, refresh the page, confirm
  it stuck.
- **Log out**, then try visiting `http://localhost:3000/admin/products`
  directly — you should be bounced straight to the login page (this proves
  no one can reach the admin panel without logging in first).

If all of that works, **Phase 3 works correctly.** ✅

---

## Project structure (for reference)

```
pure-deshi/
├── app/
│   ├── page.js                       ← placeholder homepage
│   ├── admin/
│   │   ├── login/page.js             ← public login screen
│   │   └── (dashboard)/              ← everything below requires login
│   │       ├── layout.js             ← the auth check + sidebar shell
│   │       ├── page.js               ← Dashboard
│   │       ├── products/page.js
│   │       ├── categories/page.js
│   │       ├── combos/page.js
│   │       ├── banners/page.js
│   │       └── settings/page.js
│   └── api/
│       ├── upload/route.js           ← Cloudinary image upload (new)
│       ├── admin/stats/route.js      ← Dashboard KPI numbers (new)
│       └── ... (products/categories/combos/banners/settings/auth from Phase 2)
├── components/
│   ├── SetupStatus.js                ← Phase 1 connection check (still on homepage)
│   └── admin/
│       ├── AdminShell.js             ← sidebar + topbar
│       └── ProductForm.js            ← the add/edit form + live preview
├── lib/
│   ├── mongodb.js, cloudinary.js, auth.js   ← from Phase 1/2
│   ├── bn.js                         ← Bengali-numeral + badge-label helpers (new)
│   ├── slugify.js                    ← auto-generates slugs from English names (new)
│   └── errors.js                     ← friendly duplicate-name error messages (new)
├── models/                            ← from Phase 2
├── scripts/seed.mjs                   ← from Phase 2
└── .env.example
```

---

## What's next (Phase 4)

Phase 4 builds the **real public-facing homepage and product pages** —
everything a customer sees: hero banners, category browsing, product cards,
the WhatsApp order button (which is what will finally start filling in the
Dashboard's "order clicks" number), and the bn/en language toggle.

Just send the next message whenever you're ready, and let me know if any
step above didn't work as described.
