import initMiddleware from "./init-middleware"
import Cors from 'cors'

export const cors = initMiddleware(
    Cors({
        origin: ['https://selfbingo.com', 'https://selfbingo.com', 'http://localhost:3000', /192\.168\./],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    })
)