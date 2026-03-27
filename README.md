# ⚙️ MotoParts — Two-Wheeler Spare Parts E-Commerce Platform

A full-stack e-commerce website for buying two-wheeler spare parts online, featuring user authentication, an admin dashboard to manage products and orders, and real-time sales statistics.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, Axios |
| Backend | Spring Boot (Java) |
| Database | PostgreSQL |
| Authentication | JWT (JSON Web Tokens) |
| Image Storage | Cloudinary |
| Build Tool | Vite |

---

## ✨ Features

### Customer Portal
- Register and login with secure JWT authentication
- Browse and search spare parts by brand, category, and bike model
- Add items to cart and place orders (Cash on Delivery)
- View order history and track order status

### Admin Portal
- Secure admin login with role-based access control
- Add, edit, and delete products with image upload (Cloudinary)
- View and manage all customer orders, update order status
- Dashboard with real-time stats — total revenue, orders, products, and customers
- Monthly revenue chart and order status breakdown
- View and manage registered users

---

## 🚀 Getting Started

### Prerequisites
Make sure the following are installed on your machine:
- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+

---

### 1. Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE motoparts;
\q
```

---

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Open `src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/motoparts
spring.datasource.username=postgres
spring.datasource.password=your_password_here

jwt.secret=YourSecretKeyHereAtLeast256BitsLong

cors.allowed-origins=http://localhost:5173
```

Start the backend:

```bash
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080`

---

### 3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:8080/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔐 Default Admin Account

| Field | Value |
|---|---|
| Email | admin@motoparts.in |
| Password | Admin@123 |

Login at: `http://localhost:5173/admin/login`

---

## 📁 Project Structure

```
motoparts/
├── backend/                  # Spring Boot backend
│   └── src/main/java/com/bikeparts/
│       ├── controller/       # REST API controllers
│       ├── model/            # Database entities
│       ├── repository/       # JPA repositories
│       ├── service/          # Business logic
│       ├── security/         # JWT filter & utils
│       └── config/           # Security & CORS config
│
└── frontend/                 # React.js frontend
    └── src/
        ├── pages/
        │   ├── customer/     # Home, Products, Cart, Orders
        │   └── admin/        # Dashboard, Products, Orders, Users
        ├── components/       # Navbar, AdminLayout, etc.
        ├── services/         # API calls (Axios)
        └── context/          # Auth & Cart context
```

---

## 📌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/products` | Get all products (public) |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/my` | Get user's orders |
| GET | `/api/admin/stats` | Dashboard statistics (admin) |
| GET | `/api/admin/orders` | All orders (admin) |
| POST | `/api/admin/products` | Add a product (admin) |
| PUT | `/api/admin/products/{id}` | Edit a product (admin) |
| DELETE | `/api/admin/products/{id}` | Delete a product (admin) |

---

## ⚠️ Common Issues

| Problem | Fix |
|---|---|
| Port 8080 already in use | Kill the process or change `server.port` in `application.properties` |
| CORS error in browser | Make sure `cors.allowed-origins` matches your frontend URL exactly |
| 401 Unauthorized | Your JWT token may have expired — log out and log back in |
| Database connection failed | Check PostgreSQL is running and credentials are correct in `application.properties` |

---
