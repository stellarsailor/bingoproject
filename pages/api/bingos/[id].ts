import { userInfo } from 'os'
import { cors } from '../../../lib/cors'
const db = require('../../../lib/db')
const escape = require('sql-template-strings')
const bcrypt = require('bcryptjs')

export default async (req, res) => {
    await cors(req, res)

    if(req.method === 'GET'){
        const [bingo] = await db.query(escape`
        SELECT id, lang, categoryId, title, description, userId, size, elements, bgMainColor, bgSubColor, fontColor, cellColor, lineColor, achievements, popularity, createdAt
        FROM bingos
        WHERE id = ${req.query.id};
        `)
        res.status(200).json({ bingo })

    } else if(req.method === 'POST'){
        const bingoId = parseInt(req.query.id)
        const binaryResult = req.body.binaryResult
        const completedMarks = parseInt(req.body.completedMarks) //completed bingo marks
        const completedLines = parseInt(req.body.completedLines) //completed bingo lines
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        const spamCheck = await db.query(escape`
            SELECT count(*) as spamCount FROM results WHERE bingoId=${bingoId} AND createdAt > date_sub(now(), interval 10 minute) AND ipAddress=${ipAddress}
        `)

        const duplicated = spamCheck[0].spamCount > 0

        if(!duplicated){ //when the submit is not duplicated recent within 10 minutes
            if(completedMarks !== 0){ //and there must be any check on bingo.
                const insertResult = await db.query(escape`
                    INSERT INTO results (bingoId, binaryResult, completedMarks, completedLines, ipAddress)
                    VALUES (${bingoId}, ${JSON.stringify(binaryResult)}, ${completedMarks}, ${completedLines}, ${ipAddress});
                `)
    
                if(insertResult.affectedRows === 1){
                    const updateBingoPopularity = await db.query(escape`
                        UPDATE bingos
                        SET popularity = popularity + 1
                        WHERE id = ${bingoId};
                    `)
                }
            }
        }
        //all results of that bingo after added one of user's
        const results = await db.query(escape`
            SELECT binaryResult, completedMarks, completedLines
            FROM results
            WHERE bingoId = ${bingoId};
        `)

        const percentage = await db.query(escape`
            SELECT * FROM (
                SELECT completedMarks, PERCENT_RANK() OVER ( ORDER BY completedMarks DESC ) AS percentage
                FROM results
                WHERE bingoId = ${bingoId}
            ) sub
            WHERE sub.completedMarks = ${completedMarks}
        `)

        res.status(200).json({ 
            error: duplicated ? 'duplicated' : null,
            percentage: duplicated ? null : //when the result is duplicated
                            completedMarks === 0 ? 1 : percentage[0].percentage, //when user submit 0 mark bingo, it shows 1(will be *100, so 100% percentage)
            results 
        })

    } else if(req.method === 'PATCH') {
        const bingoId = parseInt(req.query.id)
        const userId = parseInt(req.body.userId)
        const accessToken = req.body.accessToken

        const category = req.body.category
        const title = req.body.title
        const description = req.body.description
        const achievements = req.body.achievements

        const compareUserId = await db.query(escape`
            SELECT count(*) as TF
            FROM bingos b, sessions s
            WHERE b.userId = s.user_id AND b.id = ${bingoId} AND b.userId = ${userId} AND s.access_token = ${accessToken};
        `)

        if(compareUserId[0].TF === 1){
            const editBingo = await db.query(escape`
                UPDATE bingos SET categoryId = ${category}, title = ${title}, description = ${description}, achievements = ${JSON.stringify(achievements)}, modifiedAt = now()
                WHERE id = ${bingoId};
            `)
            if(editBingo.affectedRows === 1){
                res.status(200).json({ results: 'success' })
            }
        } else {
            res.status(401).json({ results: 'error' })
        }

    } else if(req.method === 'DELETE'){
        const bingoId = parseInt(req.query.id)
        const userId = parseInt(req.body.userId)
        const accessToken = req.body.accessToken

        const compareUserId = await db.query(escape`
            SELECT count(*) as TF
            FROM bingos b, sessions s
            WHERE b.userId = s.user_id AND b.id = ${bingoId} AND b.userId = ${userId} AND s.access_token = ${accessToken};
        `)

        if(compareUserId[0].TF === 1){
            const deleteBingo = await db.query(escape`
                DELETE FROM bingos
                WHERE id = ${bingoId};
            `)
            if(deleteBingo.affectedRows === 1){
                res.status(200).json({ results: 'success' })
            }
        } else {
            res.status(401).json({ results: 'error' })
        }
    }
}