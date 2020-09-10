const db = require('../../../lib/db')
const escape = require('sql-template-strings')
const bcrypt = require('bcryptjs')

export default async (req, res) => {
    if(req.method === 'GET'){
        const [bingo] = await db.query(escape`
        SELECT *
        FROM bingos
        WHERE id = ${req.query.id};
        `)
        res.status(200).json({ bingo })

    } else if(req.method === 'POST'){
        const bingoId = parseInt(req.query.id)
        const binaryResult = req.body.binaryResult
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        const spamCheck = await db.query(escape`
            SELECT count(*) as spamCount FROM results WHERE createdAt > date_sub(now(), interval 1 minute) AND ipAddress=${ipAddress}
        `)

        if(spamCheck[0].spamCount > 0){
            const results = await db.query(escape`
                SELECT binaryResult
                FROM results
                WHERE bingoId = ${bingoId};
            `)

            res.status(200).json({ error: 'duplicated', results })
        } else {
            // console.log(insertResult) 이때 모든 요소가 숫자인지 검사하고 예외처리가 필요한가?
            const insertResult = await db.query(escape`
                INSERT INTO results (bingoId, binaryResult, ipAddress)
                VALUES (${bingoId}, ${JSON.stringify(binaryResult)}, ${ipAddress});
            `)

            if(insertResult.affectedRows === 1){
                const updateBingoPopularity = await db.query(escape`
                    UPDATE bingos
                    SET popularity = popularity + 1
                    WHERE id = ${bingoId};
                `)
    
                //all results of that bingo after added one of user's
                const results = await db.query(escape`
                SELECT binaryResult
                FROM results
                WHERE bingoId = ${bingoId};
                `)
                res.status(200).json({ results })
            } else {
                res.status(404)
            }
        }


    } else if(req.method === 'DELETE'){
        const bingoId = parseInt(req.query.id)
        const password = req.body.password

        const hashFromDB = await db.query(escape`
            SELECT password 
            FROM bingos
            WHERE id = ${bingoId};
        `)

        if (bcrypt.compareSync(password, hashFromDB[0].password) === true){
            const deleteBingo = await db.query(escape`
                DELETE FROM bingos
                WHERE id = ${bingoId};
            `)
            if(deleteBingo.affectedRows === 1){
                res.status(200).json({ results: 'success' })
            } else {
                res.status(200).json({ results: 'error' })
            }
        } else {
            res.status(200).json({ results: 'wrong' })
        }
    }
}