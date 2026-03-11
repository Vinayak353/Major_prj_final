-- MotoParts Database Schema
-- Run this script against your PostgreSQL database

CREATE DATABASE motoparts;
\c motoparts;

-- Users table
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(15),
    role        VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN')),
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);

-- Products table
CREATE TABLE products (
    id                   BIGSERIAL PRIMARY KEY,
    name                 VARCHAR(255) NOT NULL,
    brand                VARCHAR(100) NOT NULL,
    model_compatibility  VARCHAR(500),
    category             VARCHAR(50) NOT NULL,
    price                DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock                INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    description          TEXT,
    image_url            VARCHAR(500),
    created_at           TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_stock ON products(stock);

-- Orders table
CREATE TABLE orders (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT NOT NULL REFERENCES users(id),
    total_amount     DECIMAL(10, 2) NOT NULL,
    status           VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                         CHECK (status IN ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    shipping_address TEXT,
    payment_id       VARCHAR(100),
    created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Order items table
CREATE TABLE order_items (
    id          BIGSERIAL PRIMARY KEY,
    order_id    BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  BIGINT NOT NULL REFERENCES products(id),
    quantity    INTEGER NOT NULL CHECK (quantity > 0),
    unit_price  DECIMAL(10, 2) NOT NULL
);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Payments table
CREATE TABLE payments (
    id                    BIGSERIAL PRIMARY KEY,
    order_id              BIGINT NOT NULL UNIQUE REFERENCES orders(id),
    razorpay_order_id     VARCHAR(100),
    razorpay_payment_id   VARCHAR(100),
    razorpay_signature    VARCHAR(500),
    status                VARCHAR(20) DEFAULT 'INITIATED'
                              CHECK (status IN ('INITIATED', 'SUCCESS', 'FAILED', 'REFUNDED')),
    amount                DECIMAL(10, 2),
    created_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id),
    product_id  BIGINT NOT NULL REFERENCES products(id),
    rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ── Seed Data ─────────────────────────────────────────────────────────────────

-- Admin user (password: Admin@123)
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin User', 'admin@motoparts.in', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Zg', '9999999999', 'ADMIN');

-- Sample products
INSERT INTO products (name, brand, model_compatibility, category, price, stock, description) VALUES
('Performance Brake Pads', 'Brembo', 'Royal Enfield Classic 350, Bullet 350, Bajaj Pulsar 150/180', 'brakes', 1299.00, 12, 'High-performance sintered brake pads for superior stopping power in all weather conditions.'),
('Air Filter Element', 'K&N', 'Honda CB300R, TVS Apache 160/200', 'engine', 899.00, 8, 'High-flow washable and reusable air filter for improved engine performance.'),
('Chain & Sprocket Kit', 'D.I.D', 'KTM 200 Duke, KTM 390 Duke', 'drivetrain', 2499.00, 5, 'Complete chain and front/rear sprocket kit with o-ring chain for extended life.'),
('Spark Plug (Iridium)', 'NGK', 'Universal – All Bikes', 'electrical', 349.00, 30, 'Iridium tipped spark plug for improved ignitability and longer service life.'),
('Front Fork Oil Seals', 'Moto Master', 'Yamaha FZ16, FZ-S, MT-15', 'suspension', 650.00, 0, 'OEM-quality fork oil seals to prevent oil leaks and maintain suspension performance.'),
('LED Headlight Assembly', 'Comet', 'Bajaj Pulsar NS200, AS200', 'electrical', 3200.00, 4, 'Full LED headlight assembly with DRL ring. Plug and play installation.'),
('Engine Oil Filter', 'Bosch', 'Universal Fit', 'engine', 180.00, 50, 'Premium oil filter for efficient filtration of engine oil contaminants.'),
('Disc Brake Rotor 320mm', 'Wave', 'Royal Enfield Himalayan, Classic 350', 'brakes', 1890.00, 3, 'Floating disc rotor with anti-lock grooves for efficient heat dissipation.'),
('Clutch Plate Set', 'Alto', 'Hero Splendor, HF Deluxe, Passion Pro', 'engine', 750.00, 15, 'Complete clutch plate set with fiber and steel plates for smooth engagement.'),
('Rear Shock Absorber', 'Gabriel', 'TVS Apache RTR 160, Apache RTR 180', 'suspension', 1450.00, 7, 'OEM replacement shock absorber for comfortable ride and stable handling.');
