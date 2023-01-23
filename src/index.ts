import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/bands", async (req:Request, res:Response) => {
    try {
        const result = await db.raw('SELECT * FROM bands')

        res.status(200).send(result)
    } catch(error){
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post('/bands', async(req:Request, res:Response) => {
    try{
        const name = req.body.name
        const id = req.body.id

        if(!id || !name){
            res.status(400)
            throw new Error("Dado inválido")
        }
        if(typeof id !== "string"){
            res.status(400)
            throw new Error("Id deve ser um texto")
        }
        if(typeof name !== "string"){
            res.status(400)
            throw new Error("Name deve ser um texto")
        }

        await db.raw(`
            INSERT INTO bands (id, name)
            VALUES("${id}", "${name}")`)
        
        res.status(200).send('Banda cadastrada com sucesso!')

    }catch(error){
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put('/bands/:id', async(req:Request, res:Response) => {
    try{
        const id = req.params.id

        const newId = req.body.id
        const newName = req.body.name

        if(newId !== undefined){
            if(typeof newId !== "string"){
                res.status(400)
                throw new Error ('Id deve ser string.')
            }
            if(newId.length < 2){
                res.status(400)
                throw new Error ('Id deve possuir no mínimo 2 caracteres.')
            }
        }
        
        if(newName !== undefined){
            if(typeof newName !== "string"){
                res.status(400)
                throw new Error ('Name deve ser string.')
            }
            if(newName.length < 3){
                res.status(400)
                throw new Error ('Name deve possuir no mínimo 3 caracteres.')
            }
        }
        
        const [band] = await db.raw(`
            SELECT * FROM bands
            WHERE id = "${id}";
        `)

        if(band){
            await db.raw(`
            UPDATE bands
            SET 
                id = "${newId || band.id}", 
                name = "${newName || band.name}"
            WHERE id = "${id}";
        `)
        } else {
            res.status(404)
            throw new Error ('Id não encontrado.')
        }

        res.status(200).send('Requisição feita com sucesso.')

    } catch (error){
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }

    }
})
