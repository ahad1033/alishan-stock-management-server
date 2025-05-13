import express from "express";

import { USER_ROLE } from "../user/user.constant";
import { CustomerControllers } from "./customer.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { CustomerValidation } from "../../validation/customer.validation";

import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// CREATE A CUSTOMER
router.post(
  "/create-customer",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  validateRequest(CustomerValidation.createCustomerZodSchema),
  CustomerControllers.createCustomer
);

// EDIT A CUSTOMER
router.patch(
  "/edit-customer/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  validateRequest(CustomerValidation.editCustomerZodSchema),
  CustomerControllers.editCustomer
);

// DELETE A CUSTOMER
router.delete(
  "/delete-customer/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  CustomerControllers.deleteCustomer
);

// GET ALL CUSTOMER
router.get(
  "/get-all-customer",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  CustomerControllers.getCustomers
);

// GET A CUSTOMER BY ID
router.get(
  "/get-single-customer/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  CustomerControllers.getCustomerById
);

export const CustomerRoutes = router;
