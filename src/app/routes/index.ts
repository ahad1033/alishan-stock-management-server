import { Router } from "express";

import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { StockRoutes } from "../modules/stock/stock.route";
import { InvoiceRoutes } from "../modules/invoice/invoice.route";
import { ProductRoutes } from "../modules/product/product.route";
import { CustomerRoutes } from "../modules/customer/customer.route";
import { EmployeeRoutes } from "../modules/employee/employee.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/stocks",
    route: StockRoutes,
  },
  {
    path: "/invoices",
    route: InvoiceRoutes,
  },
  {
    path: "/employees",
    route: EmployeeRoutes,
  },
  {
    path: "/customers",
    route: CustomerRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
