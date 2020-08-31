const db = require('../../../lib/db')
const escape = require('sql-template-strings')

export default async (req, res) => {
    if(req.method === 'GET'){
        const [bingo] = await db.query(escape`
        SELECT *
        FROM bingos
        WHERE id = ${req.query.id}
        `)
        res.status(200).json({ bingo })

    } else if(req.method === 'POST'){
        const bingoId = parseInt(req.query.id)
        const binaryResult = req.body.binaryResult
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        const insertResult = await db.query(escape`
            INSERT INTO results (bingoId, binaryResult, ipAddress)
            VALUES (${bingoId}, ${JSON.stringify(binaryResult)}, ${ipAddress});
        `)

        // console.log(insertResult) 이때 모든 요소가 숫자인지 검사하고 예외처리가 필요한가?
        if(insertResult.affectedRows === 1){
            const results = await db.query(escape`
            SELECT binaryResult
            FROM results
            WHERE bingoId = ${bingoId}
            `)
            res.status(200).json({ results })
        } else {
            res.status(404)
        }

    }
}


// export default (req, res) => {
//     console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
//     // console.log(req.headers['x-real-ip'] || req.connection.remoteAddress)
//     const { query: { id } } = req

//     res.json({ user: { id, name: 'Test bingo' } })
// }