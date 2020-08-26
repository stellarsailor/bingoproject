const db = require('../../../lib/db')
const escape = require('sql-template-strings')

export default async (req, res) => {
    let lang = req.query.lang || 'en'
    let page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 9

    if (page < 1) page = 1

    const bingos = await db.query(escape`
        SELECT *
        FROM bingos
        WHERE lang = ${lang}
        ORDER BY id
        LIMIT ${(page - 1) * limit}, ${limit}
    `)
    
    res.status(200).json({ bingos })
}