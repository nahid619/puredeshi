# Pure Deshi — Website Project

This is the real codebase for the Pure Deshi website, being built in phases.
**This delivery is cumulative Phases 1–4: Infrastructure + Data Layer/Auth +
Admin Panel + the real public website.**

---

## What's new in Phase 4 — the real public site

The placeholder homepage is gone. `http://localhost:3000` is now the actual
Pure Deshi homepage, built exactly to the mockup, but with every number,
name, and price pulled live from your database instead of hardcoded:

- **Hero** — headline + a "trending product" spotlight card (whichever
  product has the new "হিরো স্পটলাইটে দেখান" toggle on in the admin panel)
- **Trust strip, category tiles, story section, testimonials** — testimonials
  are still placeholder text on purpose (Phase 5 replaces them with real
  Facebook reviews)
- **A product grid section for every category you have**, in the order
  you've set — add a category in the admin panel and a whole new homepage
  section appears automatically, no code changes
- **Combo offer banner** — shows automatically if you have an active combo,
  hides itself if you don't
- **Language toggle (বাং/EN)** and **dark/light mode** — top-right pills,
  affects the entire page instantly
- **Real WhatsApp ordering** — every "Order Now" button (product cards, hero
  spotlight, combo banner, floating button) opens WhatsApp with a message
  built from your actual Settings template and the real product name/price
- **Product detail pages** at `/products/<slug>` — the Naturo-style template
  (intro → benefits → ingredients → usage → why us) using whatever you typed
  into each product's content fields in the admin panel
- **Scroll-reveal animations** on every section, matching the mockup

### Two small fixes worth knowing about
1. The database already had an `isTrending` field meant to drive the hero
   spotlight, separate from the "ফিচার্ড" toggle — but the Phase 3 admin
   panel never exposed a control for it. I added one ("হিরো স্পটলাইটে দেখান")
   in the product form. The "ফিচার্ড" toggle now does something slightly
   different and more useful: it just sorts that product to the front of its
   own category grid.
2. Categories now have an optional **tagline** (e.g. "Kitchen essentials"
   above "Ghee & Oil") — editable in the admin Categories tab. The 4 seeded
   categories already have the same taglines as the original mockup.

---

## Step-by-step: how to test this

### 1. Re-run the seed script
Even if you seeded before, run this again — it's always safe to re-run, and
this time it'll backfill the new category taglines and the trending flag on
Sundarban Honey:
```
npm run seed
```

### 2. Start the project
```
npm run dev
```

### 3. Open the real homepage
Go to **http://localhost:3000**. You should see the full site: hero with
Sundarban Honey in the spotlight, trust strip, category tiles, then a
section for each category with real products, the story section, the
breakfast combo banner, testimonials, and footer.

### 4. Things specifically worth clicking
- **বাং / EN pill** (top right) — toggles every piece of text on the page
- **Sun/moon icon** — toggles dark mode across the whole site
- **Click a product's name or photo** — opens its detail page with the
  content you wrote in the admin panel
- **Click any "Order Now" / "অর্ডার করুন" button** — should open WhatsApp
  (or a new tab) with a pre-filled message containing the real product name
  and price. Try it in both languages — the product name in the message
  should switch, matching whichever language was active when you clicked.
- **Scroll down slowly** — sections should fade/slide in as they enter view
- **The floating green WhatsApp button** (bottom-right) — should pulse gently
  and open a blank WhatsApp chat with your number
- Go to **`/admin/products`**, turn on "হিরো স্পটলাইটে দেখান" for a
  *different* product, save, then refresh the homepage — the hero spotlight
  card should now show that product instead

### 5. Confirm clicks are actually being tracked
Click "Order Now" on a couple of products, then go to **`/admin`**
(Dashboard) — "এই মাসে অর্ডার ক্লিক" and "সবচেয়ে জনপ্রিয়" should now show real
numbers instead of zero/"no data yet".

If all of that works, **Phase 4 works correctly.** ✅

---

## What I couldn't test from my side, and why

My sandbox can only reach a short allow-list of domains (npm, GitHub,
Ubuntu's package servers) — it can't reach MongoDB Atlas, Cloudinary, or
Google Fonts. So I couldn't watch the real homepage render against your
actual seeded data the way you will. To compensate, I built a temporary
version of the homepage and product page with realistic fake data standing
in for the database, ran it, and confirmed every section (hero, badges,
sale pricing, out-of-stock state, combo, product detail content, Bengali
numeral prices) rendered correctly with zero errors — then removed that
test version before packaging this ZIP. The real, database-driven version
is what's in your hands now; the test checklist above is how you confirm it
end-to-end with your real data.

---

## Project structure (what's new)

```
pure-deshi/
├── app/
│   ├── page.js                    ← real homepage (Server Component, fetches from MongoDB)
│   ├── error.js, not-found.js     ← friendly error/404 pages for the public site
│   ├── products/[slug]/page.js    ← product detail page
│   └── api/
│       └── track-click/route.js   ← logs WhatsApp button clicks for the Dashboard
├── components/site/                ← all public-site UI (Header, Hero, ProductCard, etc.)
│   ├── SiteProviders.js           ← language + dark mode context
│   ├── Reveal.js                  ← scroll-fade-in wrapper
│   └── OrderButton.js             ← shared WhatsApp order button
└── lib/whatsapp.js                ← builds the wa.me link from Settings + product data
```

---

## What's next (Phase 5)

Phase 5 is content, not code: real product photos uploaded through the
admin panel (replacing the icon placeholders), real Bangla/English copy for
every product's detail page, real testimonials swapped in from the Facebook
page, and the real WhatsApp number in Settings. Let me know when you're
ready, or if anything in the test checklist above didn't work as described.
