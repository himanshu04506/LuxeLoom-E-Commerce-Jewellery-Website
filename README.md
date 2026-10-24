# LuxeLoom — Premium Full-Stack Jewellery E-Commerce Platform

LuxeLoom is a full-stack demonstration Jewellery E-Commerce website built with **React.js, Node.js, Express.js, MongoDB**, and **Tailwind CSS**. It features **dynamic gold and silver price calculations** based on live market rates, **Razorpay payment integration**, **Google Maps live delivery tracking**, **automated chatbot support**, **email notifications (Nodemailer)**, and an **Executive Admin Control Center**.

> **Demo project:** Includes public demo accounts and mock payment/delivery behavior. Review authentication, payments, configuration, and data handling before production use. Keep real credentials in the ignored `server/.env` file.

---

## Key Features

1. **Dynamic Metal Rate Pricing Engine**:
   - Fetches live gold (24K, 22K, 18K) and silver (925) rates per gram.
   - Calculates item prices dynamically using the exact formula:  
     $$\text{Base Metal Price} = \text{Weight} \times \text{Rate/Gram}$$  
     $$\text{Wastage Charges} = \text{Base Metal Price} \times \frac{\text{Wastage \%}}{100}$$  
     $$\text{Subtotal} = \text{Base Metal Price} + \text{Making Charges} + \text{Wastage Charges} + \text{Stone Charges}$$  
     $$\text{GST} = \text{Subtotal} \times 3\%$$  
     $$\text{Final Price} = \text{Subtotal} + \text{GST}$$
   - **Backend Recalculation**: Prices are strictly validated and recalculated on the server during cart addition, checkout, and order creation.

2. **Razorpay Payment Integration**:
   - Secure Razorpay Order creation on the server.
   - HMAC SHA256 signature verification.
   - Atomic inventory stock reduction upon successful payment.
   - Built-in sandbox/test mode fallback so checkout works seamlessly even without active live API keys.

3. **Google Maps Express Delivery Tracking**:
   - Interactive live map visualizer showing warehouse origin, driver coordinates along GPS route, destination pin, and speed indicator.
   - Delivery timeline stepper: `PLACED → PAYMENT_CONFIRMED → PROCESSING → PACKED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED`.

4. **Automated Chatbot & After-Sales Concierge Support**:
   - Intelligent rule-based chatbot answering order status, delivery timelines, return policies, and payment issues.
   - Complaint ticket creation portal with photo attachments.
   - Direct phone hotline escalation (`+91 1800-LUXELOOM`) for unresolved issues.

5. **Executive Admin Control Center**:
   - Analytics metrics (Total Sales, Pending Orders, Low Stock Products, Open Tickets, Live Rates).
   - Product Manager (CRUD weight, purity, making charges, stock, images).
   - Order Dispatch Manager (Update status & trigger customer email notifications).
   - Metal Rate Override Panel (Manually update gold/silver rates in real-time).
   - Complaint Resolver & User Account Governance.

---

## Default Test Credentials

For local development and testing:

- **Customer Test Account**:
  - **Email**: `user@luxeloom.com`
  - **Password**: `user123`
- **Administrator Account**:
  - **Email**: `admin@luxeloom.com`
  - **Password**: `admin123`

---

## Installation & Setup Guide

### Prerequisites
- **Node.js**: v18.0+ or v20.0+
- **npm**: v9.0+
- **MongoDB**: Local MongoDB server or MongoDB Atlas URI (graceful fallback connection enabled if MongoDB is offline).

### 1. Clone & Install Dependencies
```bash
# Clone the workspace repository
cd LuxeLoom

# Install root, server, and client dependencies
npm run setup
```

### 2. Environment Configuration
Create a `.env` file in the `server` directory (copy the root `.env.example` template to `server/.env`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/luxeloom
JWT_SECRET=

RAZORPAY_KEY_ID=rzp_test_luxeloom12345
RAZORPAY_KEY_SECRET=

GOOGLE_MAPS_API_KEY=your_google_maps_key
METAL_API_KEY=your_metal_api_key

SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=support@luxeloom.com
SMTP_PASS=your_app_password
FROM_EMAIL="LuxeLoom Jewellery" <no-reply@luxeloom.com>

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

Generate a unique JWT secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and set `JWT_SECRET` in `server/.env`. The server requires this value to start. Razorpay secrets must also be configured locally for real payments.

### 3. Seed Database
Run the database seeder to populate 20+ luxury jewellery items, categories, metal rates, and default test accounts:

```bash
npm run seed
```

### 4. Run Development Servers
Start both backend Express API and Vite React frontend concurrently:

```bash
# Run server & client together
npm run dev

# Or run separately in two terminals:
# Terminal 1 (Backend):
npm run server

# Terminal 2 (Frontend):
npm run client
```

- **Frontend Application**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000`

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register a new member
- `POST /api/auth/login` — Login user or admin
- `GET /api/auth/me` — Get current profile
- `PUT /api/auth/profile` — Update profile details

### Products & Catalogue
- `GET /api/products` — List products with filters, search & live calculated prices
- `GET /api/products/:id` — Get product detail with itemized pricing breakdown
- `GET /api/products/categories` — List jewellery categories

### Metal Rates
- `GET /api/metals/rates` — Get current live gold/silver market rates per gram
- `POST /api/metals/sync` — Trigger external metal rate API refresh (Admin)

### Shopping Cart
- `GET /api/cart` — Get user cart with live recalculated prices
- `POST /api/cart/add` — Add item to cart
- `PUT /api/cart/update` — Update item quantity
- `DELETE /api/cart/remove/:productId` — Remove item from cart

### Orders & Payments
- `POST /api/orders` — Create order & Razorpay payment order ID
- `GET /api/orders` — Get user's order history
- `POST /api/payments/verify` — Verify Razorpay HMAC signature & deduct inventory
- `GET /api/tracking/:orderId` — Live map GPS tracking coordinates & delivery timeline

### Concierge Support & Chatbot
- `POST /api/support/chatbot` — Query automated AI/rule-based chatbot
- `POST /api/support` — Create complaint ticket
- `GET /api/support` — List user's support tickets

### Admin Control Center
- `GET /api/admin/stats` — Executive dashboard metrics & sales total
- `POST /api/admin/products` — Add new jewellery product
- `PUT /api/admin/products/:id` — Edit product
- `DELETE /api/admin/products/:id` — Delete product
- `GET /api/admin/orders` — List all customer orders
- `PUT /api/admin/orders/:id/status` — Update order status & send email notification
- `PUT /api/admin/metal-rates` — Override gold & silver rates per gram

---

## Production Build & Deployment

To create a production build for client and server:

```bash
# Build frontend bundle
npm run build

# Start production Node server
NODE_ENV=production npm run server
```

---

## License
&copy; 2026 LuxeLoom Fine Jewellery. All Rights Reserved.
