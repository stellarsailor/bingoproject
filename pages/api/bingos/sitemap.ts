import { cors } from "../../../lib/cors";
const db = require("../../../lib/db");
const escape = require("sql-template-strings");

export default async (req, res) => {
  await cors(req, res);

  if (req.method === "GET") {
    //for sitemap, return all id with lang to make https://selfbingo/[lang]/bingo/[id] element
    const bingos = await db.query(escape`
        SELECT id, lang
        FROM bingos;
        `);

    res.status(200).json(bingos);
  }
};
