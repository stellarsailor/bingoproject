// import dbConnect from '../../../utils/dbConnect'

// export default async (req, res) => {
//     try {
//         await dbConnect()
//     } catch (error) {
//         throw error
//     }
    
//     res.json({test: 'hi'})
// }

const db = require('../../../lib/db')
const escape = require('sql-template-strings')

export default async (req, res) => {

    const bingos = await db.query(escape`
        SELECT *
        FROM bingos
        ORDER BY id
    `)

    res.status(200).json({ bingos })
}