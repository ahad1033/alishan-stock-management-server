import express from "express";

import { USER_ROLE } from "../user/user.constant";
import { ExpenseControllers } from "./expense.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { ExpenseValidation } from "../../validation/expense.validation";

import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// ADD EXPENSE
router.post(
  "/add-expense",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  validateRequest(ExpenseValidation.createExpenseZodSchema),
  ExpenseControllers.addExpense
);

// EDIT EXPENSE
router.patch(
  "/edit-expense/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  validateRequest(ExpenseValidation.editExpenseZodSchema),
  ExpenseControllers.editExpense
);

// DELETE EXPENSE
router.delete(
  "/delete-expense/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  ExpenseControllers.deleteExpense
);

// GET ALL EXPENSE
router.get(
  "/get-all-expense",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  ExpenseControllers.getExpense
);

// GET A EXPENSE BY ID
router.get(
  "/get-single-expense/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  ExpenseControllers.getExpenseById
);

export const ExpenseRoutes = router;
