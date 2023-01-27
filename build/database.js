"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchases = exports.products = exports.users = void 0;
exports.users = [
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
];
exports.products = [
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
];
exports.purchases = [
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
];
//# sourceMappingURL=database.js.map