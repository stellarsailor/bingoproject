const db = require('../../../lib/db')
const escape = require('sql-template-strings')

export default async (req, res) => {
    const [bingo] = await db.query(escape`
    SELECT *
    FROM bingos
    WHERE id = ${req.query.id}
    `)
    res.status(200).json({ bingo })
}


// export default (req, res) => {
//     console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
//     // console.log(req.headers['x-real-ip'] || req.connection.remoteAddress)
//     const { query: { id } } = req

//     res.json({ user: { id, name: 'Test bingo' } })
// }