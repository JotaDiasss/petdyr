import app from "./app"
import "dotenv/config"
import { conectarBanco } from "./db/database.js"

const port = process.env.PORT

async function startServer() {
    try {
        await conectarBanco()

        app.listen(port, () => {
            console.log(`servidor rodando em http://localhost:${port}`)
        })
    } catch (err) {
        console.error(`Erro ao iniciar servidor: ${err}`)
        process.exit(1)
    }
}

startServer()
