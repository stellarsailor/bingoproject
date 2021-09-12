import { cors } from "../../../lib/cors";
const db = require("../../../lib/db");
const escape = require("sql-template-strings");

export default async (req, res) => {
  await cors(req, res);

  const categories = await db.query(escape`
        SELECT *
        FROM categories
        ORDER BY id
    `);

  res.status(200).json({ categories });
};
