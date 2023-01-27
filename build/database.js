"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurchasesFromUserId = exports.createPurchase = exports.queryProductsByName = exports.getProductsById = exports.getAllProducts = exports.createProduct = exports.getAllUsers = exports.createUser = exports.purchases = exports.products = exports.users = void 0;
const types_1 = require("./types");
exports.users = [
    {
        id: "bananinha",
        email: "bananinha@email.com",
        password: "bananinha01"
    },
    {
        id: "vitor",
        email: "vitor@email.com",
        password: "vitor123"
    }
];
exports.products = [
    {
        id: "chocolate",
        name: "nestle",
        price: 4.90,
        category: types_1.Category.FOOD
    },
    {
        id: "bolo",
        name: "bolo de cenoura",
        price: 9.90,
        category: types_1.Category.FOOD
    }
];
exports.purchases = [
    {
        userId: "bananinha",
        productId: "chocolate",
        quantity: 2,
        totalPrice: 9.80
    },
    {
        userId: "vitor",
        productId: "bolo",
        quantity: 1,
        totalPrice: 9.90
    }
];
const createUser = (id, email, senha) => {
    const newUser = {
        id: id,
        email: email,
        password: senha
    };
    exports.users.push(newUser);
    console.log("Cadastro realizado com sucesso!");
};
exports.createUser = createUser;
const getAllUsers = () => {
    console.table(exports.users);
};
exports.getAllUsers = getAllUsers;
const createProduct = (id, name, price, category) => {
    const newProduct = {
        id: id,
        name: name,
        price: price,
        category: category
    };
    exports.products.push(newProduct);
    console.log("Produto criado com sucesso!");
};
exports.createProduct = createProduct;
const getAllProducts = () => {
    console.table(exports.products);
};
exports.getAllProducts = getAllProducts;
const getProductsById = (idToSearch) => {
    return exports.products.filter((product) => {
        return (product.id === idToSearch);
    });
};
exports.getProductsById = getProductsById;
const queryProductsByName = (q) => {
    const query = exports.products.filter((product) => {
        return (product.name.toLowerCase().includes(q.toLowerCase()));
    });
    console.table(query);
};
exports.queryProductsByName = queryProductsByName;
const createPurchase = (userId, productId, quantity, totalPrice) => {
    const newPurchase = {
        userId,
        productId,
        quantity,
        totalPrice
    };
    exports.purchases.push(newPurchase);
    console.log("Compra realizada com sucesso!");
    console.table(exports.purchases);
};
exports.createPurchase = createPurchase;
const getAllPurchasesFromUserId = (userIdToSearch) => {
    return exports.purchases.filter((purchase) => {
        return (purchase.userId.toLowerCase().includes(userIdToSearch.toLowerCase()));
    });
};
exports.getAllPurchasesFromUserId = getAllPurchasesFromUserId;
//# sourceMappingURL=database.js.map