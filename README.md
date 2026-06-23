# Pure Deshi — Website Project

This is the real codebase for the Pure Deshi website, being built in phases.
**This delivery is cumulative Phases 1–5.**

---

## What's new in Phase 5 — real content

Phase 5 is mostly content, not code — but one real content gap needed a code
fix to support it properly (see below).

### 1. Real bilingual content for all 13 products
Previously only Pabna Ghee had real intro/benefits/ingredients/usage/"why us"
text — the other 12 products had nothing. I've written real Bangla **and**
English copy for all 13, following the brand voice rule from the spec
(simple everyday Bangla — "খাঁটি" / "পুরনো নিয়মে তৈরি", never "ঐতিহ্যবাহী").
This is in `scripts/seed.mjs` — **run `npm run seed` again** to load it in.

### 2. Fixed: product content wasn't actually bilingual
While writing this, I found that the database's `content` field only ever
stored Bangla text — there was no English version at all. So toggling to
English on a product page would still show Bangla benefit/usage text under
an English heading. I extended the schema with parallel English fields,
added matching English textareas to the admin product form (each section
now shows বাংলা and English side by side), and updated the product page to
actually switch between them. If you ever leave an English field blank for
a product you add yourself, it gracefully falls back to showing the Bangla
text rather than a blank section.

### 3. The three footer pages now exist
Delivery Info, Return Policy, and FAQ were dead links before. They're now
real pages with honest starter content (delivery is COD/nationwide-courier,
matching what the trust strip already says; the return policy is marked as
a draft for you to confirm matches your actual practice; the FAQ covers the
basics already true of the site). Edit the text directly in
`components/site/DeliveryInfoContent.js`, `ReturnPolicyContent.js`, and
`FaqContent.js` if you want to change the wording — these aren't database
content yet, just static bilingual text in the code, since they don't need
day-to-day editing the way products do.

---

## What I genuinely cannot do — and need from you

The rest of Phase 5, per the original plan, is real assets that only you
have:

1. **Your real WhatsApp business number** — currently a placeholder in
   Settings. Update it yourself in `/admin/settings`, or tell me the number
   and I'll explain exactly where it goes.
2. **Real product photos** — once you have photos (even phone photos are
   fine to start), upload them per-product in `/admin/products` → edit →
   the image box. I can't take or generate product photography myself.
3. **Real testimonials from your Facebook page** — I can format and
   translate real reviews you paste to me, but I can't fabricate customer
   quotes or access your Facebook page directly.
4. **Your real Facebook page URL** — also goes in `/admin/settings`.

None of these need a new code delivery from me — they're all editable
through the admin panel you already have, except testimonials and the 3
footer pages (static text, as noted above) which I'd edit directly if you
send me the real content.

---

## Step-by-step: how to test this

1. **Re-run the seed script** (safe to run again):
   ```
   npm run seed
   ```
2. **Start the project**: `npm run dev`
3. **Check a few product pages** — e.g. `/products/sundarban-honey`,
   `/products/formalin-free-mango` — confirm the benefits/ingredients/usage
   sections are filled in, in Bangla. Toggle to English (top-right pill) and
   confirm the same sections switch to English text.
4. **Check the new footer pages** — click "Delivery Info", "Return Policy",
   and "FAQ" in the footer, confirm they load real content instead of dead
   links, in both languages.
5. **In `/admin/products`**, edit any product and confirm you now see
   **two** boxes for each content section — বাংলা and English side by side.

---

## Project structure (what's new)

```
pure-deshi/
├── app/
│   ├── delivery-info/page.js
│   ├── return-policy/page.js
│   └── faq/page.js
├── components/site/
│   ├── InfoPageClient.js          ← shared layout for the 3 pages above
│   ├── DeliveryInfoContent.js
│   ├── ReturnPolicyContent.js
│   └── FaqContent.js
├── lib/site-data.js               ← shared categories/settings fetch for simple pages
├── models/Product.js              ← content fields now have bn + en versions
└── scripts/seed.mjs               ← all 13 products now have full bilingual content
```

---

## What's next (Phase 6)

Phase 6 is QA & polish — a once-over for mobile responsiveness, broken
links, loading states, and cross-browser checks before launch. Phase 7
after that is the actual go-live (domain, DNS, final Vercel deploy). Let me
know once you've had a chance to add your real WhatsApp number and any
photos you have, and we can move forward.
