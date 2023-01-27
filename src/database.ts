import { TProduct, TPurchase, TUser } from "./types";

export const users:TUser[] = [
    {
        id: "bananinha",
        email: "bananinha@email.com",
        password: "bananinha01"

    },
    { 
        id: "zinho",
        email: "zinho@email.com",
        password: "zinho123"

    }
]

export const products:TProduct[] = [
    {
        id: "chocolate",
        name: "suflair",
        price: 4.90,
        category: "doce"
    },
    {
        id: "bolo",
        name: "bolo de cenoura",
        price: 15.90,
        category: "doce"
    }
    
]

export const purchases:TPurchase[] = [
    {
        userId: "bananinha",
        productId: "chocolate",
        quantity: 2,
        totalPrice: 9.80
    },
    {
        userId: "zinho",
        productId: "bolo",
        quantity: 1,
        totalPrice: 15.90
    }
]