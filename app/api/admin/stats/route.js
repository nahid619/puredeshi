// app/api/admin/stats/route.js
//
// Powers the 4 KPI cards on the admin Dashboard tab (Section 8 of spec).
// "This month's order clicks" and "most popular product" depend on
// ClickLog, which isn't written to by anything yet — that happens in
// Phase 4 when the public site's real WhatsApp order button is built.
// Until then this honestly reports zero/"no data yet" rather than
// inventing numbers.

import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Product from "@/models/Product";
import ClickLog from "@/models/ClickLog";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const totalProducts = await Product.countDocuments();
    const outOfStockCount = await Product.countDocuments({ inStock: false });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthClicks = await ClickLog.countDocuments({
      timestamp: { $gte: startOfMonth },
    });

    const popular = await ClickLog.aggregate([
      { $group: { _id: "$productId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    let mostPopularProduct = null;
    if (popular.length > 0) {
      const product = await Product.findById(popular[0]._id);
      mostPopularProduct = product ? product.nameBn : null;
    }

    return Response.json({
      totalProducts,
      outOfStockCount,
      monthClicks,
      mostPopularProduct, // null = "no click data yet"
    });
  } catch (err) {
    return Response.json(
      { error: `Database error: ${err.message}` },
      { status: 500 }
    );
  }
}
