import { cors } from '../../../lib/cors'
const db = require('../../../lib/db')
const escape = require('sql-template-strings')
const bcrypt = require('bcryptjs')

export default async (req, res) => {
    await cors(req, res)

    if(req.method === 'GET'){

    } else if(req.method === 'POST'){
        const bingoId = req.body.bingoId
        const type = req.body.type
        const text = req.body.text
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        const insertResult = await db.query(escape`
            INSERT INTO reports (bingoId, type, text, ipAddress)
            VALUES (${bingoId}, ${type}, ${text}, ${ipAddress});
        `)

        res.status(200).json({ insertResult })
    }
}