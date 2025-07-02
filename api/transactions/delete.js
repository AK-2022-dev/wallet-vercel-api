import { sql } from '../../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.query;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: "Invalid transaction ID" });
  }

  try {
    const result = await sql`
      DELETE FROM transactions WHERE id=${id} RETURNING *
    `;
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
