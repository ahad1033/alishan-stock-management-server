# Alishan - Backend (Stock Management System)

This is the **backend service** for **Alishan**, a full-featured stock management web application built using **TypeScript**, **Node.js**, **Express**, and **MongoDB**. The backend handles all business logic, user roles, data validation, and secure API interactions to support the frontend system.

---

## 🚀 Features

### ✅ Authentication & Authorization

- JWT-based secure authentication system.
- Role-based access control for:
  - **Admin**: Full access.
  - **Stock Manager**: Access to product stock and adjustment functionalities.
  - **Accountant**: Access to invoices, expenses, collections, and customers.

### 🧑 User & Role Management

- Create and manage users (admin, stock manager, accountant).
- Only Admin can manage users.

### 📦 Product & Stock Management

- Add, update, and delete products.
- Add stock entries with product and date.
- Deduct stock via invoice number (confirmed by Stock Manager).
- View complete stock history.

### 👥 Customer Management

- Create, update, and delete customer records.
- Automatically track:
  - Total purchases
  - Total paid
  - Total due amounts (updated via invoices and collections)

### 📄 Invoice System

- Create invoices linked to customers.
- Track total amount, paid amount, and due.
- Invoice does not affect stock until deduction is confirmed.
- Each invoice updates customer balance and system revenue.

### 💰 Expense Tracking

- Add and manage expenses with category (e.g., Salary, Rent).
- Salary category requires selecting an employee.
- Tracks:
  - Current balance
  - Total revenue
  - Total expenses

### 🧾 Collection Module

- Add collection entries to reduce customer due.
- View collection history.

### 👨‍💼 Employee Management

- Add, update, and delete employee records.
- Track monthly salary payment history (if paid via expense of category "Salary").

### 📊 Analytics Dashboard

- Recent expenses
- Last 15 days sales
- Revenue vs. Expenses
- Customer metrics and more

---

## 🏗️ Tech Stack

| Tech           | Description               |
| -------------- | ------------------------- |
| **Language**   | TypeScript                |
| **Runtime**    | Node.js                   |
| **Framework**  | Express.js                |
| **Database**   | MongoDB with Mongoose ODM |
| **Validation** | Zod                       |
| **Security**   | JWT, dotenv, CORS         |

---

## 📁 Project Structure

```bash
src/
├── app/
│ ├── config/          # MongoDB, server config, etc.
│ ├── middlewares/     # Error handler, auth guard, role guard
│ ├── modules/         # Business logic by domain
│ │ ├── auth/
│ │ ├── balance/
│ │ ├── collection/
│ │ ├── customer/
│ │ ├── employee/
│ │ ├── expense/
│ │ ├── invoice/
│ │ ├── product/
│ │ ├── stock/
│ │ └── user/
│ ├── routes/          # Combined API routes
│ ├── utils/           # Helper functions
│ ├── validation/      # Zod schema validations
│ └── app.ts           # App entry (Express instance)
├── server.ts          # Server startup
├── .env.example       # Sample environment variables
└── ...


---

## 📬 API Overview


| Module      | Route Path     | Description                             |
| ----------- | -------------- | --------------------------------------- |
| Auth        | `/auth`        | Login, token generation                 |
| Users       | `/users`       | Create/manage users (admin only)        |
| Products    | `/products`    | CRUD operations on products             |
| Stock       | `/stocks`      | Add/deduct stock, view history          |
| Customers   | `/customers`   | CRUD customers, view financials         |
| Invoices    | `/invoices`    | Create invoices, link with customers    |
| Collections | `/collections` | Add collection against dues             |
| Employees   | `/employees`   | Manage employees, track salaries        |
| Expenses    | `/expenses`    | Add/view expenses with categories       |
| Balance     | `/balances`    | Total revenue, expense, current balance |


## ✅ Roles & Permissions

| Feature / Role   | Admin | Stock Manager | Accountant |
| ---------------- | :---: | :-----------: | :--------: |
| Manage Users     |   ✔️  |       ❌     |      ❌    |
| View Products    |   ✔️  |       ✔️     |      ✔️    |
| Manage Stock     |   ✔️  |       ✔️     |      ❌    |
| Create Invoices  |   ✔️  |       ❌     |      ✔️    |
| Manage Expenses  |   ✔️  |       ❌     |      ✔️    |
| View Collections |   ✔️  |       ❌     |      ✔️    |
| Manage Employees |   ✔️  |       ❌     |      ❌    |
| Access Analytics |   ✔️  |       ❌     |      ❌    |



# Clone the frontend repository
git clone https://github.com/ahad1033/alishan-stock-management-server
cd alishan-stock-management-server

# Install dependencies
yarn install

# Start development server
yarn start
```
