// lib/site-data.js
//
// Every public page needs the same three things for its header/footer:
// categories (for nav links), settings (WhatsApp number/templates), and
// whether there's an active combo (to decide whether to show that nav
// link). Shared here so each page doesn't repeat the same three queries.

import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import Settings from "@/models/Settings";
import Combo from "@/models/Combo";

export async function getSiteChrome() {
  await connectToDatabase();

  const [categoriesRaw, settingsRaw, comboCount] = await Promise.all([
    Category.find().sort({ sortOrder: 1 }),
    (async () => {
      let s = await Settings.findOne();
      if (!s) s = await Settings.create({});
      return s;
    })(),
    Combo.countDocuments({ isActive: true }),
  ]);

  return {
    categories: JSON.parse(JSON.stringify(categoriesRaw)),
    settings: JSON.parse(JSON.stringify(settingsRaw)),
    hasActiveCombo: comboCount > 0,
  };
}
