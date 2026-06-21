// models/ClickLog.js
//
// Optional/nice-to-have, per the project spec — logs every time someone taps
// an "Order Now" button on the public site. Not wired up to anything yet
// (that happens in Phase 4 when the real WhatsApp order flow is built), but
// the schema exists now so the admin dashboard's "most popular product" and
// "this month's order-clicks" KPI cards have something to query later.

import mongoose from "mongoose";

const ClickLogSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.ClickLog ||
  mongoose.model("ClickLog", ClickLogSchema);
