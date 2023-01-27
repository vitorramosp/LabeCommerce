import { users, products, purchases, createUser, getAllUsers, createProduct, getAllProducts, getProductsById, queryProductsByName, createPurchase, getAllPurchasesFromUserId } from "./database";
import { Category } from "./types";
import express, { Request, Response } from "express"
import cors from 'cors';
import {TUser, TProduct, TPurchase} from "./types"
import { db } from "./database/knex";


const app = express()
app.use(express.json())
app.use(cors())

app.listen(3004, () => {
    console.log("Servidor rodando na porta 3004")
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})


//GET USERS
app.get(`/users`, async(req: Request , res: Response) => {
    try{
        //res.status(200).send(getAllUsers())
        const result = await db.raw("SELECT * FROM users;")

        res.status(200).send(result)

    }catch(error:any){
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


//GET PRODUCTS
app.get(`/products`, async(req:Request, res: Response) => {
    try{
        //res.status(200).send(getAllProducts())
        const result = await db.raw("SELECT * FROM products;")

        res.status(200).send(result)
    }catch(error:any){
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

//GET SEARCH PRODUCTS
app.get(`/products/search`, async(req:Request, res: Response) => {
    try{
        const q = req.query.q as string

        if(q.length<=0){
            res.status(400)
            throw new Error("A busca deve ter pelo menos um caractere.")
        }

        const result = await db.raw(`
            SELECT * FROM products
            WHERE name LIKE "%${q}%";
        `)

        // const result = products.filter((product) => {
        //     return product.name.toLowerCase().includes(q.toLowerCase()) 
        // })

        res.status(200).send(result)
    }catch(error:any){
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

//POST CREATE USERS
app.post(`/users`, async(req:Request, res: Response) => {
    try{
        // const newUser = {
        //     id,
        //     email,
        //     password
        // }
        // users.push(newUser)
        const {id, email, password, name} = req.body as TUser

        if(!id){
            res.status(404)
            throw new Error("Coloque uma id para criar um novo usuário.")
        }
        if(!email){
            res.status(404)
            throw new Error("Coloque um email para criar um novo usuário.")
        }
        if(!password){
            res.status(404)
            throw new Error("Coloque uma password para criar um novo usuário.")
        }
        if(!name){
            res.status(404)
            throw new Error("Coloque um nome para criar um novo usuário.")
        }

        if(users.find((user) => user.id === id)){
            res.status(404)
            throw new Error("Esse id já existe. Crie outro.")
        }

        if(users.find((user) => user.email === email)){
            res.status(404)
            throw new Error("Esse email já existe. Crie outro.")
        }

        // createUser(id, email, password)
        await db.raw(`
            INSERT INTO users (id, email, password, name)
            VALUES
            ("${id}", "${email}", "${password}", "${name}");`)
        res.status(201).send("Novo usuário registrado com sucesso!")
    }catch(error:any){
        console.log(error)
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
})

// POST CREATE PRODUCTS
app.post(`/products`, async(req:Request, res: Response) => {
    try{
        const {id, name, price, description, imageUrl} = req.body as TProduct
        // const newProduct = {
        //     id,
        //     name,
        //     price,
        //     category
        // }
        // products.push(newProduct)
        if(!id){
            res.status(404)
            throw new Error("Coloque uma id.")
        }
        if(!name){
            res.status(404)
            throw new Error("Coloque um nome.")
        }
        if(!price){
            res.status(404)
            throw new Error("Coloque um preço.")
        }
        if(!description){
            res.status(404)
            throw new Error("Coloque uma descrição.")
        }
        if(!imageUrl){
            res.status(404)
            throw new Error("Coloque uma imagem.")
        }

        if(products.find((product) => product.id === id)){
            res.status(404)
            throw new Error("Esse id já existe. Crie outro.")
        }

        // createProduct(id, name, price, category)
        await db.raw(`
        INSERT INTO products (id, name,price, description, imageUrl)
        VALUES
        ("${id}", "${name}", ${price}, "${description}", "${imageUrl}");`)
        res.status(201).send("Produto cadastrado com sucesso!")

    } catch(error:any){
        console.log(error)
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
})

// GET PURCHASES
app.get(`/purchases`, (req:Request, res: Response) => {
    res.status(200).send(purchases)
})

//POST CREATE PURCHASES
app.post(`/purchases`, (req:Request, res: Response) => {
    try{
        const {userId, productId, quantity, totalPrice} = req.body as TPurchase

        if(!userId){
            res.status(404)
            throw new Error("Coloque um userId.")
        }
        if(!productId){
            res.status(404)
            throw new Error("Coloque um productId.")
        }
        if(!quantity){
            res.status(404)
            throw new Error("Nescessario pelo menos 1 produto.")
        }
        if(!totalPrice){
            res.status(404)
            throw new Error("Coloque o preço.")
        }
        if(!(users.find((user) => user.id === userId))){
            res.status(404)
            throw new Error("O usuário não existe. Escolha um usuário existente.")
        }
        if(!(products.find((product) => product.id === productId))){
            res.status(404)
            throw new Error("O produto não existe. Escolha outro.")
        }

        const newPurchase = {
            userId,
            productId,
            quantity,
            totalPrice
        }

        purchases.push(newPurchase)
        res.status(201).send("Compra realizada!")

    }catch(error:any){
        console.log(error)
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
    
})

//GET PRODUCTS BY ID
app.get(`/products/:id`, (req:Request, res:Response) => {
    try{
        const id = req.params.id
        
        if(!(products.find((product) => product.id === id))){
            res.status(404)
            throw new Error("O id do produto não existe. Escolha um produto existente.")
        }

        res.status(200).send(getProductsById(id))
    }catch(error:any){
        console.log(error)
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
})

//GET PURCHASES BY USER ID
app.get(`/users/:id/purchases`, (req:Request, res:Response) => {
    try{
        const id = req.params.id

        if(!(users.find((user) => user.id === id))){
            res.status(404)
            throw new Error("O id do usuário não existe. Escolha um usuário existente.")
        }

        res.status(200).send(getAllPurchasesFromUserId(id))

    }catch(error:any){
        console.log(error)
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
})

//DELETE USERS BY ID
app.delete(`/users/:id`, (req:Request, res:Response) => {
    try{
        const id = req.params.id

        if(!(users.find((user) => user.id === id))){
            res.status(404)
            throw new Error("O id do usuário não existe. Escolha um usuário existente.")
        }

        const userIndex = users.findIndex((user) => user.id === id)

        if (userIndex >= 0) {
            users.splice(userIndex, 1)
        }

        res.status(200).send("Usuário deletado com sucesso")

    }catch(error:any){
        console.log(error)
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)

    }
})

//DELETE PRODUCTS BY ID
app.delete(`/products/:id`, (req:Request, res:Response) => {
    try{
        const id = req.params.id

        if(!(products.find((product) => product.id === id))){
            res.status(404)
            throw new Error("O id do produto não existe. Escolha um produto existente.")
        }

        const productIndex = products.findIndex((product) => product.id === id)

        if (productIndex >= 0){
            products.splice(productIndex, 1)
        }

        res.status(200).send("Produto deletado com sucesso")

    }catch(error:any){
        console.log(error)
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
})

//PUT USERS BY ID
app.put(`/user/:id`, (req:Request, res:Response) => {
    try{
        const id = req.params.id

        if(!(users.find((user) => user.id === id))){
            res.status(404)
            throw new Error("O id do usuário não existe. Escolha um usuário existente.")
        }
       
        const newEmail = req.body.email as string | undefined    
        const newPassword = req.body.password as string | undefined      

        const user = users.find((user) => user.id === id)

        if(!newEmail){
            res.status(404)
            throw new Error("O email não existe. Escolha um novo email.")
        }
        if(!newPassword){
            res.status(404)
            throw new Error("A senha não existe. Escolha uma nova senha.")
        }

        if (user) {
            user.email = newEmail || user.email
            user.password = newPassword || user.password
        }

        res.status(200).send("Cadastro atualizado com sucesso")

    }catch(error:any){
        console.log(error)
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
})

//PUT PRODUCT BY ID
app.put(`/product/:id`, (req:Request, res:Response) => {
    try{
        const id = req.params.id

        if(!(products.find((product) => product.id === id))){
            res.status(404)
            throw new Error("O id do produto não existe. Escolha um produto existente.")
        }

        const newName = req.body.name as string | undefined    
        const newPrice = req.body.price as number | undefined
        const newCategory = req.body.category as Category | undefined

        if(!newName){
            res.status(404)
            throw new Error("Escreva um novo nome.")
        }
        if(!newPrice){
            res.status(404)
            throw new Error("Escreva um novo preço.")
        }
        if(!newCategory){
            res.status(404)
            throw new Error("Escreva uma nova categoria.")
        }

        const product = products.find((product) => product.id === id)

        if (product) {
            product.name = newName || product.name
            product.price = newPrice || product.price
            product.description = newCategory || product.description
        }

        res.status(200).send("Produto atualizado com sucesso")

    }catch(error:any){
        console.log(error)
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
})