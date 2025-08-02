# Alishan Stock Management System - Backend

A robust, scalable backend API for the Alishan Stock Management System built with **TypeScript**, **Node.js**, **Express**, and **MongoDB**. This backend provides secure authentication, role-based access control, and comprehensive business logic for inventory management, invoicing, expense tracking, and financial analytics.

## 🌐 Live Links

- **Frontend Application**: [https://alishan-stock-management.vercel.app](https://alishan-stock-management.vercel.app)
- **Frontend Repository**: [https://github.com/ahad1033/alishan-stock-management-client](https://github.com/ahad1033/alishan-stock-management-client)
- **Backend Repository**: [https://github.com/ahad1033/alishan-stock-management-server](https://github.com/ahad1033/alishan-stock-management-server)

---

## 🚀 Features

### ✅ Authentication & Authorization

- **JWT-based secure authentication** with access and refresh tokens
- **Role-based access control** with three distinct roles:
  - **Admin**: Full system access and user management
  - **Stock Manager**: Product and stock management access
  - **Accountant**: Financial operations (invoices, expenses, collections)

### 📦 Product & Stock Management

- **Product CRUD operations** with detailed product information
- **Stock tracking** with add/deduct functionality
- **Stock history** with complete audit trail
- **Invoice-based stock deduction** with confirmation workflow

### 👥 Customer Management

- **Customer profile management** with contact information
- **Automatic financial tracking**:
  - Total purchases
  - Total paid amounts
  - Outstanding dues
- **Collection management** against customer dues

### 📄 Invoice System

- **Invoice creation** with customer linking
- **Automatic calculations** for totals, paid amounts, and dues
- **PDF generation** capability
- **Revenue tracking** integration

### 💰 Financial Management

- **Expense tracking** with categorized entries
- **Salary management** with employee linking
- **Balance tracking** (revenue, expenses, current balance)
- **Collection management** for customer payments

### 👨‍💼 Employee Management

- **Employee profile management**
- **Salary history tracking** (when paid via expenses)
- **Role-based access** (Admin only)

### 📊 Analytics Dashboard

- **Revenue analytics** with trend analysis
- **Expense tracking** and categorization
- **Customer metrics** and insights
- **Financial summaries** and reports

---

## 🏗️ Tech Stack

| Technology     | Description                          |
| -------------- | ------------------------------------ |
| **TypeScript** | Type-safe JavaScript development     |
| **Node.js**    | JavaScript runtime environment       |
| **Express.js** | Web application framework            |
| **MongoDB**    | NoSQL database with Mongoose ODM     |
| **JWT**        | JSON Web Tokens for authentication   |
| **Zod**        | Schema validation and type inference |
| **bcrypt**     | Password hashing and security        |
| **CORS**       | Cross-origin resource sharing        |
| **dotenv**     | Environment variable management      |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Yarn** (recommended) or **npm**
- **MongoDB** (local or cloud instance)
- **Git**

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
# Clone the backend repository
git clone https://github.com/ahad1033/alishan-stock-management-server
cd alishan-stock-management-server
```

### 2. Install Dependencies

```bash
# Using Yarn (recommended)
yarn install

# Or using npm
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Create environment file
touch .env
```

Add the following environment variables to your `.env` file:

```env
# Server Configuration
PORT=5000

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/alishan-stock-management
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/alishan-stock-management

# Security Configuration
BCRYPT_SALT_ROUNDS=10

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key-here
JWT_ACCESS_EXPIRES_IN=10d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRES_IN=10d

# Super Admin Configuration
SUPER_ADMIN_PASSWORD=your-super-admin-password
```

### 4. Database Setup

#### Local MongoDB

```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `DATABASE_URL` in your `.env` file

### 5. Build and Start the Application

```bash
# Build the TypeScript code
yarn build

# Start the development server
yarn start:dev

# Or start production server
yarn start
```

The API will be available at `http://localhost:5000`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── config/                  # Configuration files
│   │   └── index.ts             # Environment and app config
│   ├── interfaces/              # TypeScript interfaces
│   │   └── express.d.ts         # Express type extensions
│   ├── middlewares/             # Custom middleware
│   │   ├── authMiddleware.ts    # JWT authentication
│   │   └── validateRequest.ts   # Request validation
│   ├── modules/                 # Business logic modules
│   │   ├── analytics/           # Analytics and reporting
│   │   ├── auth/                # Authentication logic
│   │   ├── balance/             # Financial balance tracking
│   │   ├── collection/          # Customer collections
│   │   ├── customer/            # Customer management
│   │   ├── employee/            # Employee management
│   │   ├── expense/             # Expense tracking
│   │   ├── invoice/             # Invoice management
│   │   ├── product/             # Product management
│   │   ├── stock/               # Stock management
│   │   └── user/                # User management
│   ├── routes/                  # API route definitions
│   │   └── index.ts             # Combined routes
│   ├── utils/                   # Utility functions
│   │   ├── generateProductCodes.ts
│   │   └── parseDate.ts
│   ├── validation/              # Zod validation schemas
│   └── app.ts                   # Express app configuration
├── server.ts                    # Server entry point
└── ...
```

---

## 📡 API Endpoints

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/refresh-token` - Refresh access token

### Users (Admin Only)

- `GET /api/v1/users` - Get all users
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Products

- `GET /api/v1/products` - Get all products
- `POST /api/v1/products` - Create new product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Stock Management

- `GET /api/v1/stocks` - Get stock history
- `POST /api/v1/stocks` - Add stock entry
- `PUT /api/v1/stocks/:id` - Update stock entry
- `DELETE /api/v1/stocks/:id` - Delete stock entry

### Customers

- `GET /api/v1/customers` - Get all customers
- `POST /api/v1/customers` - Create new customer
- `PUT /api/v1/customers/:id` - Update customer
- `DELETE /api/v1/customers/:id` - Delete customer

### Invoices

- `GET /api/v1/invoices` - Get all invoices
- `POST /api/v1/invoices` - Create new invoice
- `PUT /api/v1/invoices/:id` - Update invoice
- `DELETE /api/v1/invoices/:id` - Delete invoice

### Collections

- `GET /api/v1/collections` - Get all collections
- `POST /api/v1/collections` - Create new collection
- `PUT /api/v1/collections/:id` - Update collection
- `DELETE /api/v1/collections/:id` - Delete collection

### Employees

- `GET /api/v1/employees` - Get all employees
- `POST /api/v1/employees` - Create new employee
- `PUT /api/v1/employees/:id` - Update employee
- `DELETE /api/v1/employees/:id` - Delete employee

### Expenses

- `GET /api/v1/expenses` - Get all expenses
- `POST /api/v1/expenses` - Create new expense
- `PUT /api/v1/expenses/:id` - Update expense
- `DELETE /api/v1/expenses/:id` - Delete expense

### Analytics

- `GET /api/v1/analytics` - Get analytics data
- `GET /api/v1/balances` - Get financial balances

---

## 🔐 Role-Based Access Control

| Feature / Role   | Admin | Stock Manager | Accountant |
| ---------------- | ----- | ------------- | ---------- |
| Manage Users     |  ✔️   |     ❌       |    ❌     |
| View Products    |  ✔️   |     ✔️       |    ✔️     |
| Manage Stock     |  ✔️   |     ✔️       |    ❌     |
| Create Invoices  |  ✔️   |     ❌       |    ✔️     |
| Manage Expenses  |  ✔️   |     ❌       |    ✔️     |
| View Collections |  ✔️   |     ❌       |    ✔️     |
| Manage Employees |  ✔️   |     ❌       |    ❌     |
| Access Analytics |  ✔️   |     ❌       |    ❌     |

---

## 🚀 Available Scripts

```bash
# Development
yarn start:dev    # Start development server with hot reload
npm run start:dev

# Production
yarn build        # Build TypeScript to JavaScript
yarn start        # Start production server
npm run build
npm start

# Other
yarn prepare      # Build before deployment
```

---

## 🌐 Deployment

### Vercel Deployment

1. **Connect to Vercel**:

   - Install Vercel CLI: `npm i -g vercel`
   - Login: `vercel login`
   - Deploy: `vercel --prod`

2. **Environment Variables**:

   - Set all environment variables in Vercel dashboard
   - Ensure `DATABASE_URL` points to your MongoDB instance

3. **Build Configuration**:
   - The `vercel.json` file is already configured
   - Builds from `dist/server.js`

### Manual Deployment

```bash
# Build the application
yarn build

# Start production server
yarn start
```

---

## 🔧 Environment Variables

| Variable                 | Description               | Default | Required |
| ------------------------ | ------------------------- | ------- | -------- |
| `PORT`                   | Server port               | `5000`  | No       |
| `DATABASE_URL`           | MongoDB connection string | -       | **Yes**  |
| `BCRYPT_SALT_ROUNDS`     | Password hashing rounds   | `10`    | No       |
| `JWT_ACCESS_SECRET`      | JWT access token secret   | -       | **Yes**  |
| `JWT_ACCESS_EXPIRES_IN`  | Access token expiry       | `10d`   | No       |
| `JWT_REFRESH_SECRET`     | JWT refresh token secret  | -       | **Yes**  |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry      | `10d`   | No       |
| `SUPER_ADMIN_PASSWORD`   | Initial admin password    | -       | **Yes**  |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/ahad1033/alishan-stock-management-server/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

## 🔗 Related Projects

- **Frontend**: [alishan-stock-management-client](https://github.com/ahad1033/alishan-stock-management-client)
- **Live Demo**: [alishan-stock-management.vercel.app](https://alishan-stock-management.vercel.app)

---

**Happy Coding! 🚀**
