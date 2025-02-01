CREATE TABLE binanceUsers (
    id       SERIAL PRIMARY KEY,
    name VARCHAR(255),
    deposit_Address VARCHAR(255) NOT NULL,
    privatekey VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance BIGINT NOT NULL DEFAULT 0
)