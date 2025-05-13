import express from "express";

import { USER_ROLE } from "../user/user.constant";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { EmployeeValidation } from "../../validation/employee.validation";

import validateRequest from "../../middlewares/validateRequest";
import { EmployeeControllers } from "./employee.controller";

const router = express.Router();

// CREATE A WORKER
router.post(
  "/create-worker",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(EmployeeValidation.createEmployeeZodSchema),
  EmployeeControllers.createEmployee
);

// GET ALL WORKER
router.get(
  "/get-all-worker",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  EmployeeControllers.getAllEmployee
);

// GET A WORKER BY ID
router.get(
  "/get-single-worker/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  EmployeeControllers.getEmployeeById
);

// DELETE A WORKER BY ID
router.delete(
  "/delete-worker/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  EmployeeControllers.deleteEmployeeById
);

// UPDATE A WORKER BY ID
router.patch(
  "/update-worker/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(EmployeeValidation.editEmployeeZodSchema),
  EmployeeControllers.updateEmployeeById
);

export const EmployeeRoutes = router;
