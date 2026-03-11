# MotoParts — Two-Wheeler Spare Parts E-Commerce Platform

A full-stack e-commerce platform for buying and selling two-wheeler spare parts online.

**Stack:** React.js · Spring Boot · PostgreSQL · Razorpay · Cloudinary · Brevo (email)

---

## Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+
- PostgreSQL 14+

---

## 1. Database Setup

```bash
# Create the database and run schema
psql -U postgres -f schema.sql
```

The schema creates all tables and inserts sample products and an admin user.

**Default Admin Credentials:**
- Email: `admin@motoparts.in`
- Password: `Admin@123`

---

## 2. Backend Setup (Spring Boot)

```bash
cd backend

# Copy and configure environment variables
cp .env.example .env
# Edit .env and fill in your actual values

# Run the application
mvn spring-boot:run

# The API will start at http://localhost:8080
```

**Required environment variables:**

| Variable | Description |
|---|---|
| `DB_URL` | PostgreSQL connection URL |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Min. 256-bit secret key |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `BREVO_API_KEY` | Brevo (Sendinblue) API key |

---

## 3. Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev

# App runs at http://localhost:3000
```

**Frontend environment variables:**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (default: http://localhost:8080/api) |
| `VITE_RAZORPAY_KEY_ID` | Razorpay publishable key (same as backend Key ID) |

---

## API Reference

### Auth Endpoints
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Customer registration | Public |
| POST | `/api/auth/login` | Customer login | Public |
| POST | `/api/auth/admin/login` | Admin login | Public |

### Product Endpoints
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/products` | List products (supports ?search, ?category, ?brand, ?page, ?size, ?sort) | Public |
| GET | `/api/products/{id}` | Get product by ID | Public |
| GET | `/api/products/featured` | Get 8 featured products | Public |
| GET | `/api/products/search?q=` | Search products | Public |
| POST | `/api/admin/products` | Create product | Admin |
| PUT | `/api/admin/products/{id}` | Update product | Admin |
| DELETE | `/api/admin/products/{id}` | Delete product | Admin |

### Order Endpoints
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/orders` | Create order | Customer |
| GET | `/api/orders/my` | Get my orders | Customer |
| GET | `/api/orders/{id}` | Get order by ID | Customer/Admin |
| PUT | `/api/orders/{id}/cancel` | Cancel order | Customer |
| GET | `/api/admin/orders` | Get all orders | Admin |
| PUT | `/api/admin/orders/{id}/status` | Update order status | Admin |

### Payment Endpoints
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/payments/create-order` | Create Razorpay order | Customer |
| POST | `/api/payments/verify` | Verify payment signature | Customer |

### Admin Endpoints
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/admin/dashboard/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PUT | `/api/admin/users/{id}/status` | Activate/deactivate user | Admin |
| DELETE | `/api/admin/users/{id}` | Delete user | Admin |

---

## Payment Integration (Razorpay)

1. Sign up at [razorpay.com](https://razorpay.com) and get your API keys from the Dashboard.
2. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to your backend `.env`.
3. Add `VITE_RAZORPAY_KEY_ID` to your frontend `.env`.
4. The Razorpay checkout loads automatically on the Checkout page.
5. **Important:** Always verify payment signature on the backend before confirming orders.

For production, integrate the [Razorpay Java SDK](https://github.com/razorpay/razorpay-java):
```xml
<dependency>
  <groupId>com.razorpay</groupId>
  <artifactId>razorpay-java</artifactId>
  <version>1.4.3</version>
</dependency>
```

---

## Image Upload (Cloudinary)

1. Create a [Cloudinary](https://cloudinary.com) account.
2. Add your cloud credentials to the backend `.env`.
3. The admin product form supports image URL input by default.
4. To enable direct upload, integrate Cloudinary's upload widget in `AdminProducts.jsx`.

---

## Email Notifications (Brevo)

1. Create a [Brevo](https://brevo.com) account.
2. Add your API key to backend `.env`.
3. Implement email sending in the Order Service after order creation using Brevo's Java SDK.

---

## Features

### Customer Portal
- Browse and search spare parts by name, brand, or bike model
- Filter by category and price range
- Product detail pages with stock availability
- Shopping cart with quantity management and session persistence
- Secure checkout with Razorpay (UPI, cards, wallets)
- Order tracking with status updates
- Order history with expandable details
- User profile management

### Admin Portal
- Dashboard with revenue, orders, products, and user stats
- Visual bar charts for monthly revenue and category breakdown
- Full product CRUD with stock management
- Order management with status updates
- User management with activate/deactivate
- Low stock alerts

### Security
- JWT authentication for all protected routes
- BCrypt password hashing
- Role-based access control (CUSTOMER / ADMIN)
- Razorpay signature verification before order confirmation
- Input validation on frontend and backend
- Global exception handler with consistent error responses
- CORS configured to allow only the frontend origin

---

## Production Checklist

- [ ] Change `JWT_SECRET` to a strong 256+ bit random key
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate` (not `update`)
- [ ] Update `cors.allowed-origins` to your production frontend domain
- [ ] Enable HTTPS on both frontend and backend
- [ ] Switch Razorpay from test to live mode
- [ ] Set up proper database backups
- [ ] Configure rate limiting (e.g., Spring Boot with Bucket4j)
- [ ] Add monitoring (e.g., Spring Boot Actuator + Prometheus)

---

## License

MIT — free to use for commercial and personal projects.
