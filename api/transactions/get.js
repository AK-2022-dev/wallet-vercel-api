import { sql } from '../../lib/db.js';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id=${userId} ORDER BY created_at DESC
    `;
    res.status(200).json(transactions.rows); // use `.rows` with @vercel/postgres
  } catch (error) {
    console.error("Error fetching the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
