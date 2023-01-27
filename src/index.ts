import { users, products, purchases, createUser, getAllUsers, createProduct, getAllProducts, getProductsById, queryProductsByName, createPurchase, getAllPurchasesFromUserId } from "./database";
import { Category } from "./types";

console.log("deu boa")

// console.table(users)
getAllProducts()
// console.table(purchases)

// createUser("u003", "beltrano@email.com", "beltrano99")

// getAllUsers()

createProduct("p004", "Televisor HD", 800, Category.ELECTRONICS)
getAllProducts()

getProductsById("p004")

queryProductsByName("televisor")

console.table(purchases)

createPurchase("093", "p004", 1, 800)

console.table(getAllPurchasesFromUserId("bananinha"))
