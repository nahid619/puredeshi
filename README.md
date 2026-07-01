# Pure Deshi

A full-stack e-commerce website for **Pure Deshi** — a Bangladeshi brand selling traditional, organic food products (ghee, honey, mustard oil, red rice, and more). Orders are placed directly via WhatsApp. The site is fully bilingual in Bangla and English.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Tabler Icons |
| Database | MongoDB Atlas via Mongoose |
| Image Hosting | Cloudinary |
| Auth | JWT (jose) + bcryptjs |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A [Cloudinary](https://cloudinary.com) account

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the template and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `AUTH_SECRET` | Random secret for signing admin sessions — generate with `openssl rand -base64 32` |
| `ADMIN_USERNAME` | Username for the admin panel |
| `ADMIN_PASSWORD` | Password for the admin panel |
| `NEXT_PUBLIC_SITE_NAME` | Displayed in page titles (default: `Pure Deshi`) |

### 3. Seed the database

Run once to create your admin account, categories, and all 13 products with full bilingual content:

```bash
npm run seed
```

> Safe to re-run — it upserts rather than duplicating.

### 4. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

---

## Project Structure

```
pure-deshi/
├── app/
│   ├── page.js                        # Homepage
│   ├── products/[slug]/page.js        # Product detail page
│   ├── delivery-info/page.js
│   ├── return-policy/page.js
│   ├── faq/page.js
│   ├── admin/
│   │   ├── login/page.js
│   │   └── (dashboard)/
│   │       ├── page.js                # Admin dashboard / KPI overview
│   │       ├── products/
│   │       ├── categories/
│   │       ├── combos/
│   │       ├── banners/
│   │       ├── testimonials/
│   │       └── settings/
│   └── api/                           # REST API routes
│       ├── products/
│       ├── categories/
│       ├── combos/
│       ├── banners/
│       ├── testimonials/
│       ├── settings/
│       ├── clicks/
│       ├── upload/
│       ├── auth/
│       └── health/
├── components/
│   ├── site/                          # Public-facing UI components
│   └── admin/                         # Admin panel UI components
├── models/                            # Mongoose schemas
│   ├── Product.js
│   ├── Category.js
│   ├── Combo.js
│   ├── Banner.js
│   ├── Testimonial.js
│   ├── Settings.js
│   ├── Admin.js
│   └── ClickLog.js
├── lib/
│   ├── mongodb.js                     # DB connection singleton
│   ├── auth.js                        # JWT helpers
│   ├── cloudinary.js                  # Upload helper
│   ├── whatsapp.js                    # Order message builder
│   ├── bn.js                          # Bangla language utilities
│   ├── site-data.js                   # Shared data fetching for pages
│   ├── slugify.js
│   └── errors.js
└── scripts/
    └── seed.mjs                       # One-time DB seeder
```

---

## Features

### Public Site
- **Homepage** — hero banner, featured products, combo deals, "Our Story" section, testimonials, and a trust badge strip
- **Product pages** — bilingual (Bangla/English) intro, benefits, ingredients, usage guide, and "why us" section; WhatsApp order button
- **Bilingual toggle** — language switcher on product pages; falls back to Bangla if English content is missing
- **Static info pages** — Delivery Info, Return Policy, FAQ (bilingual)
- **Floating WhatsApp button** — site-wide shortcut to start an order conversation

### Admin Panel (`/admin`)
- **Products** — create/edit/delete; bilingual fields side by side; Cloudinary image upload; badges, stock status, featured/trending flags
- **Categories** — name, slug, icon, tagline (bilingual)
- **Combos** — bundle multiple products at a discounted price with a cover image
- **Banners** — homepage slider images with optional links
- **Testimonials** — customer reviews with avatar initials, name, role, quote (bilingual)
- **Settings** — WhatsApp number, phone number, Facebook URL, tagline, logo, "Our Story" text, trust badges — all editable without a code change
- **Dashboard** — order-click stats (most-clicked products, clicks this month) via `ClickLog`

---

## Deployment (Vercel)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com).
2. Add all variables from `.env.example` under **Settings → Environment Variables**.
3. Deploy. Vercel handles the Next.js build automatically.

> Make sure your MongoDB Atlas cluster allows connections from `0.0.0.0/0` (or Vercel's IP range) under **Network Access**.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Seed the database (admin account + all products) |
| `npm run lint` | Run ESLint |