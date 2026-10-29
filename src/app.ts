import express from "express"
import { validarEntrada } from "./middleware/validarEntrada"
import animalRouter from "./routes/animal.routes"
import donoRouter from "./routes/dono.routes"
import petRouter from "./routes/pet.routes"

const app = express()

app.use(express.json())
app.use(validarEntrada)

app.get("/", (_req, res) => {
  res.send("API funcionando")
})

app.use(animalRouter)
app.use(donoRouter)
app.use(petRouter)

export default app
