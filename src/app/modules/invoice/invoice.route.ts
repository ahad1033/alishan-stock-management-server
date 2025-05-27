import express from "express";

import { USER_ROLE } from "../user/user.constant";
import { InvoiceControllers } from "./invoice.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { InvoiceValidation } from "../../validation/invoice.validation";

import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// CREATE A INVOICE
router.post(
  "/create-invoice",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  validateRequest(InvoiceValidation.createInvoiceZodSchema),
  InvoiceControllers.createInvoice
);

// EDIT A INVOICE
router.patch(
  "/edit-invoice/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  validateRequest(InvoiceValidation.editInvoiceZodSchema),
  InvoiceControllers.editInvoice
);

// DELETE A INVOICE
router.delete(
  "/delete-invoice/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  InvoiceControllers.deleteInvoice
);

// GET ALL INVOICE
router.get(
  "/get-all-invoice",
  authMiddleware(
    USER_ROLE.super_admin,
    USER_ROLE.admin,
    USER_ROLE.accountant,
    USER_ROLE.stock_manager
  ),
  InvoiceControllers.getInvoice
);

// GET A INVOICE BY ID
router.get(
  "/get-single-invoice/:id",
  authMiddleware(
    USER_ROLE.super_admin,
    USER_ROLE.admin,
    USER_ROLE.accountant,
    USER_ROLE.stock_manager
  ),
  InvoiceControllers.getInvoiceById
);

export const InvoiceRoutes = router;
