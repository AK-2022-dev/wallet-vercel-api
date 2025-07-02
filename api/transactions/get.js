import { sql } from '../../lib/db.js';

export default async function handler(req, res) {
  const { userId } = req.query;
  console.log("🧪 Incoming userId:", userId);

  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const result = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    console.log("✅ Transactions fetched:", result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error); // <--- show real error
    res.status(500).json({ message: "Internal server error" });
  }
}
