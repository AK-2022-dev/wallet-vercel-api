import { sql } from '../../lib/db.js';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id=${userId}
    `;
    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id=${userId} AND amount > 0
    `;
    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions WHERE user_id=${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult.rows[0].balance,
      income: incomeResult.rows[0].income,
      expenses: expensesResult.rows[0].expenses,
    });
  } catch (error) {
    console.error("Error getting the summary", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
