import { sql } from '../../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { title, amount, category, user_id } = req.body;

  if (!title || !user_id || !category || amount === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const transaction = await sql`
      INSERT INTO transactions(user_id, title, amount, category)
      VALUES(${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;
    res.status(201).json(transaction.rows[0]);
  } catch (error) {
    console.error("Error creating the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
