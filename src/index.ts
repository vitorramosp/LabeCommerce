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

//GET ALL USERS
app.get(`/users`, async(req: Request , res: Response) => {
    try{
        const result = await db("users").select("id", "name", "email", "password","created_at AS createdAt")

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
        
        const {id, name, email, password} = req.body as TUser

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("'id' deve ser string.")
        }
        if(id.length < 4){
            res.status(400)
            throw new Error("'id' deve possuir pelo menos 4 caracteres.")
        }
        if(id[0] !== "i"){
            res.status(404)
            throw new Error("'id' deve começar com a letra i.")
        }
        if(typeof name !== "string"){
            res.status(400)
            throw new Error("'name' deve ser string.")
        }
        if(name.length < 2){
            res.status(400)
            throw new Error("'name' deve possuir pelo menos 2 caracteres.")
        }
        if(typeof email !== "string"){
            res.status(400)
            throw new Error("'email' deve ser string.")
        }
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
			throw new Error("O 'email' deve ser do tipo 'test@email.com'.")
		}
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
			throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}
        
        const [userIdAlreadyExist] = await db("users").where({id})
        if(userIdAlreadyExist){
            res.status(400)
            throw new Error("id já existe.")
        }

        const [userEmailAlreadyExist] = await db("users").where({email})
        if(userEmailAlreadyExist){
            res.status(400)
            throw new Error("email já existe.")
        }

        const newUser:TUser = {
            id,
            name,
            email, 
            password
        }

        await db("users").insert(newUser)
        res.status(201).send({
            message: "Cadastro realizado com sucesso",
            user: newUser})

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

//GET ALL PRODUCTS
app.get(`/products`, async(req:Request, res: Response) => {
    try{
        const searchTerm = req.query.q as string | undefined

        if(searchTerm === undefined){
            const result = await db("products").select("id", "name", "price", "description","image_url AS imageUrl")
            res.status(200).send(result)
        }else{
            const resultSearchTerm = await db("products")
            .where("name", "LIKE", `%${searchTerm}%`)
            .orWhere("description", "LIKE", `%${searchTerm}%`)
            res.status(200).send(resultSearchTerm)
        }

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


// POST CREATE PRODUCTS
app.post(`/products`, async(req:Request, res: Response) => {
    try{
        const {id, name, price, description, image_url} = req.body

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("'id' deve ser string.")
        }
        if(id[0] !== "p"){
            res.status(404)
            throw new Error("'id' deve começar com a letra 'p'.")
        }
        if(id[1] !== "o"){
            res.status(404)
            throw new Error("'id' deve começar com a letra 'p' e depois 'o'.")
        }
        if(typeof name !== "string"){
            res.status(400)
            throw new Error("'name' deve ser string.")
        }
        if(typeof price !== "number"){
            res.status(400)
            throw new Error("'price' deve ser number.")
        }
        if(typeof description !== "string"){
            res.status(400)
            throw new Error("'description' deve ser string.")
        }
        // if(typeof imageUrl === "string"){
        //     res.status(400)
        //     throw new Error("'image_url' deve ser string.")
        // }

        const [productIdAlreadyExist] = await db("products").where({id})
        if(productIdAlreadyExist){
            res.status(400)
            throw new Error("id já existe.")
        }

        const newProduct: TProduct = {
            id,
            name,
            price,
            description,
            image_url
        }

        const productShow = {
            id,
            name,
            price,
            description,
            image_url
        }

        await db("products").insert(newProduct)
        res.status(201).send({
            message: "Produto cadastrado com sucesso",
            product: productShow})

    } catch(error:any){
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

//PUT PRODUCT BY ID
app.put(`/product/:id`, async (req:Request, res:Response) => {
    try{
        const idToEdit = req.params.id

        if(idToEdit[0] !== "p"){
            res.status(404)
            throw new Error("'id' deve começar com a letra 'p'.")
        }
        if(idToEdit[1] !== "o"){
            res.status(404)
            throw new Error("'id' deve começar com a letra 'p' e 'o'.")
        }

        const newName = req.body.name
        const newPrice = req.body.price
        const newDescription = req.body.description
        const newImageUrl = req.body.imageUrl

        if(newName !== undefined){
            if(typeof newName !== "string"){
                res.status(400)
                throw new Error("'name' deve ser string.")
            }
            if(newName.length < 2){
                res.status(400)
                throw new Error("'name' deve possuir pelo menos 2 caracteres.")
            }
        }

        if(newPrice !== undefined){
            if(typeof newPrice !== "number"){
                res.status(400)
                throw new Error("'price' deve ser number.")
            }
        }
        
        if(newDescription !== undefined){
            if(typeof newDescription !== "string"){
                res.status(400)
                throw new Error("'description' deve ser string.")
            }
            if(newDescription.length < 2){
                res.status(400)
                throw new Error("'description' deve possuir pelo menos 2 caracteres.")
            }
        }
        
        if(newImageUrl !== undefined){
            if(typeof newImageUrl !== "string"){
                res.status(400)
                throw new Error("'imageUrl' deve ser string.")
            }
        }

        const [productToEdit] : TProduct[] | undefined[] = await db("products").where({id : idToEdit})
        
        if(!productToEdit){
            res.status(404)
            throw new Error("id não encontrado.")
        }

        const newProduct = {
            name: newName || productToEdit.name,
            price: newPrice || productToEdit.price,
            description: newDescription || productToEdit.description,
            image_url: newImageUrl || productToEdit.image_url
        }

        const productShow = {
            name: newName || productToEdit.name,
            price: newPrice || productToEdit.price,
            description: newDescription || productToEdit.description,
            imageUrl: newImageUrl || productToEdit.image_url
        }

        await db("products").update(newProduct).where({id: idToEdit})
        res.status(200).send({
            message: "Produto atualizado com sucesso",
            product: productShow})

    }catch(error:any){
        console.log(error)
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }
})

// GET ALL PURCHASES
app.get(`/purchases`, async(req:Request, res: Response) => {
    try{
        const result = await db("purchases").select("id", "total_price AS totalPrice", "created_at AS createdAt", "paid","buyer AS buyerId")

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

//POST PURCHASE
app.post("/purchases", async (req: Request, res: Response) => {

    try {

        const newIdPurchase = req.body.id
        const newBuyer = req.body.buyer
        const newProducts = req.body.products

        const {productId, quantity} = newProducts

        const [idExist] = await db("purchases").where({id: newIdPurchase})

        if(idExist){
            res.status(400)
            throw new Error("Id já cadastrado")
        }

        if(newIdPurchase[0] !== "p" && newIdPurchase[1] !== "u"){
            res.status(400)
            throw new Error("O id deve iniciar com 'pu'.")
        }

        if (!newIdPurchase || !newBuyer|| !newProducts) {
            res.status(400)
            throw new Error("Falta adicionar id, buyer e produtos.")
        }

        if (typeof newIdPurchase !== "string" &&
            typeof newBuyer !== "string") {
            res.status(400)
            throw new Error("'userId' e 'productId' são string.")
        }

        let newPriceTotal = 0

        const bodyPurchase = {
            id: newIdPurchase,
            buyer: newBuyer,
            total_price: newPriceTotal
        }

        await db("purchases").insert(bodyPurchase)

        const products = []

        for(let item of newProducts){
            const [addItem] = await db("products").where({ id: item.id})
            newPriceTotal += addItem.price * item.quantity
            await db("purchases_products").insert({purchase_id: newIdPurchase , product_id: item.id, quantity: item.quantity})
            const completeProduct = {
                ...addItem,
                quantity
            }
            products.push(completeProduct)
        }

        await db("purchases").update({total_price: newPriceTotal}).where({ id: newIdPurchase})

        const result = {
            id: bodyPurchase.id,
            buyer: bodyPurchase.buyer,
            totalPrice: newPriceTotal,
            products
        }

        res.status(201).send({ 
            message: "Pedido realizado com sucesso",
            purchase: result
        })

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// DELETE PURCHASE BY ID
app.delete("/purchases/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        if(idToDelete[0] !== "p"){
            res.status(404)
            throw new Error("'id' deve começar com a letra p.")
        }

        const [purchaseIdToDelete] = await db("purchases").where({id:idToDelete})

        if(!purchaseIdToDelete){
            res.status(404)
            throw new Error("'id' não encontrado.")
        }

        await db("purchases_products").del().where({purchase_id: idToDelete})
        await db("purchases").del().where({id:idToDelete})
        res.status(200).send({message:"Pedido cancelado com sucesso"})        
		
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

//GET PURCHASE BY ID
app.get("/purchases/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const [purchase] = await db("purchases").where({ id: id })
        if (purchase) {

            const [purchaseWithUser] = await db("purchases")
                .select(
                    "purchases.id AS purchaseID",
                    "purchases.total_price AS totalPrice",
                    "purchases.created_at AS createdAt",
                    "purchases.paid",
                    "users.id AS buyerID",
                    "users.email",
                    "users.name")
                .innerJoin("users", "purchases.buyer", "=", "users.id")
                .where({ "purchases.id": id })

            const productFromPurchase = await db("purchases_products")
                .select("purchases_products.product_id AS id",
                    "products.name",
                    "products.price",
                    "products.description",
                    "products.image_URL AS imageUrl",
                    "purchases_products.quantity")
                .innerJoin("products", "products.id", "=", "purchases_products.product_id")
                .where({ purchase_id: id })

            const result = { ...purchaseWithUser, productsList: productFromPurchase }

            res.status(200).send(result)

        } else {
            res.status(404)
            throw new Error("Compra não encontrada");

        }

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send({ message: error.message })
        } else {
            res.send({ message: "Erro inesperado" })
        }
    }
})