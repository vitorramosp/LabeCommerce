-- Active: 1673873440214@@127.0.0.1@3306
CREATE Table users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

PRAGMA table_info ('users');

INSERT INTO users (id, email, password)
VALUES
("i001", "vitor@email.com", "vitor123"),
("i002", "guilherme@email.com", "guilherme123"),
("i003", "marina@email.com", "mari123");

SELECT * FROM users;

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);

PRAGMA table_info ('products');

INSERT INTO products (id, name,price,category)
VALUES
("p001", "Tenis", 5.99, "vestuário"),
("p002", "Arte da Guerra", 50, "livro"),
("p003", "Camisa", 10.9, "vestuário"),
("p004", "Celular", 110, "eletrônico"),
("p005", "Doce", 32, "comida");

SELECT * FROM products;

SELECT * FROM products
WHERE name LIKE "arte%";

INSERT INTO users (id, email, password)
VALUES
("i004", "gabriel@email.com", "gabriel123");

INSERT INTO products (id,name,price,category)
VALUES
("p006", "Narnia", 40, "livro");

SELECT * FROM products
WHERE id LIKE "p006";

DELETE FROM users
WHERE id LIKE 'i003';

DELETE FROM products
WHERE id LIKE 'p002';

UPDATE users
SET email = "novogui@email.com",
    password = "novogui123"
WHERE id = 'i001';

UPDATE products
SET price = 4.2,
    name = 'camisa'
WHERE id = 'p003';

SELECT * FROM users
ORDER BY id ASC;

SELECT * FROM products
ORDER BY price ASC
LIMIT 20
OFFSET 0;

SELECT * FROM products
WHERE price >= 10 AND price <= 70
ORDER BY price ASC;

CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL, 
    total_price REAL UNIQUE NOT NULL, 
    paid INTEGER NOT NULL, 
    delivered_at TEXT, 
    buyer_id TEXT NOT NULL, 
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);

INSERT INTO purchases (id, total_price, paid, delivered_at, buyer_id)
VALUES 
    ("p001", 100, 0, NULL, "i001"), 
    ("p002", 35.9, 1, "2023-01-18", "i001"), 
    ("p003", 40, 0, NULL, "i002"), 
    ("p004", 78, 0, NULL, "i002"), 
    ("p005", 99.99, 0, NULL, "i004"), 
    ("p006", 25, 0, NULL, "i004");

SELECT * FROM purchases
INNER JOIN  users
ON purchases.buyer_id = users.id
WHERE users.id = "i004";

UPDATE purchases
SET delivered_at = DATETIME('now'),
    paid = 1
WHERE id = 'p006';
