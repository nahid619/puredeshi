# Pure Deshi — Website Project

This is the real codebase for the Pure Deshi website, being built in phases.
**This delivery is Phase 1: Infrastructure Setup.**

If you've never run a Next.js project before, follow every step below exactly
— don't skip anything, even if it looks obvious.

---

## What's in this Phase 1 delivery

- A working Next.js project (the framework the whole site will be built on)
- The brand colors and fonts (Baloo Da 2 / Hind Siliguri) wired up
- The real Pure Deshi logo, in two forms (`public/images/logo-emblem.png` and `public/images/logo-full.jpg`)
- A connection helper for MongoDB Atlas (database) and Cloudinary (image hosting)
- A placeholder homepage with a **"Setup Status"** panel that tells you whether
  your MongoDB and Cloudinary accounts are correctly connected — this is how
  you'll test this phase, no command-line skills needed beyond starting the server.

There are no real products, pages, or admin panel yet — that's Phase 2 onward.

---

## Step-by-step: how to run this on your computer

### 1. Install Node.js (skip if already done)
Download the **LTS** version from https://nodejs.org and install it like any
normal program.

### 2. Unzip this project
Unzip the file you downloaded anywhere on your computer (e.g. your Desktop).
You should see a folder called `pure-deshi` with files like `package.json`,
`app/`, `public/`, etc.

### 3. Open a terminal in that folder
- **Windows:** open the `pure-deshi` folder in File Explorer, click the
  address bar, type `cmd`, press Enter.
- **Mac:** open Terminal, type `cd ` (with a space), then drag the
  `pure-deshi` folder into the terminal window, press Enter.

### 4. Install the project's dependencies
Type this and press Enter (only needs to be done once, takes a minute or two):
```
npm install
```

### 5. Create your environment file
Make a copy of `.env.example` and rename the copy to `.env.local`. This file
will hold your private MongoDB/Cloudinary credentials. Leave the values blank
for now if you haven't created those accounts yet — the app will still run.

### 6. Start the project
```
npm run dev
```
You'll see a message like `Local: http://localhost:3000`.

### 7. Open it in your browser
Go to **http://localhost:3000**. You should see:
- The Pure Deshi logo and tagline
- A green "PHASE 1 — INFRASTRUCTURE SETUP" badge
- A **Setup Status** card showing grey dots for MongoDB Atlas and Cloudinary
  (grey = not configured yet, which is expected until you add real credentials)

If you see all of that, **Phase 1 works correctly.** ✅

---

## How to test the MongoDB / Cloudinary connections for real

Once you've created your MongoDB Atlas and Cloudinary accounts (see the
prerequisites list from our chat):

1. Open `.env.local` in any text editor (Notepad is fine).
2. Paste your MongoDB Atlas connection string after `MONGODB_URI=`
3. Paste your Cloudinary Cloud name / API key / API secret after the matching lines.
4. Save the file.
5. Stop the server (press `Ctrl + C` in the terminal) and run `npm run dev` again
   — environment variable changes need a restart to take effect.
6. Refresh http://localhost:3000 — the dots should turn **green** with
   "Connected successfully" for each service. If a dot turns **red/dark**,
   the message next to it will explain what went wrong (usually a typo in
   the connection string or an IP allow-list issue in Atlas).

---

## Project structure (for reference)

```
pure-deshi/
├── app/
│   ├── page.js              ← the placeholder homepage you see at localhost:3000
│   ├── layout.js            ← loads the brand fonts, wraps every page
│   ├── globals.css          ← brand colors as CSS variables
│   └── api/health/route.js  ← checks MongoDB + Cloudinary connections
├── components/
│   └── SetupStatus.js       ← the green/grey/red status card
├── lib/
│   ├── mongodb.js           ← reusable database connection helper
│   └── cloudinary.js        ← Cloudinary SDK configuration
├── public/images/           ← logo files
├── .env.example             ← template — copy to .env.local and fill in
└── package.json
```

---

## What's next (Phase 2)

Once you confirm Phase 1 works and have your MongoDB/Cloudinary/GitHub/Vercel
accounts ready, Phase 2 will add:
- The real database schemas (Product, Category, Combo, Banner, Settings, Admin)
- The 13 real products seeded into the database
- Admin login

Just send the next message whenever you're ready, and let me know if any
step above didn't work as described.
