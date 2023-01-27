"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const types_1 = require("./types");
console.log("deu boa");
(0, database_1.getAllProducts)();
(0, database_1.createProduct)("p004", "Televisor HD", 800, types_1.Category.ELECTRONICS);
(0, database_1.getAllProducts)();
(0, database_1.getProductsById)("p004");
(0, database_1.queryProductsByName)("televisor");
console.table(database_1.purchases);
(0, database_1.createPurchase)("093", "p004", 1, 800);
console.table((0, database_1.getAllPurchasesFromUserId)("bananinha"));
//# sourceMappingURL=index.js.map