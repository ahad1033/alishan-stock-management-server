import express from "express";

import { USER_ROLE } from "../user/user.constant";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { EmployeeValidation } from "../../validation/employee.validation";

import validateRequest from "../../middlewares/validateRequest";
import { EmployeeControllers } from "./employee.controller";

const router = express.Router();

// CREATE A EMPLOYEE
router.post(
  "/create-employee",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(EmployeeValidation.createEmployeeZodSchema),
  EmployeeControllers.createEmployee
);

// GET ALL EMPLOYEE
router.get(
  "/get-all-employee",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  EmployeeControllers.getAllEmployee
);

// GET A EMPLOYEE BY ID
router.get(
  "/get-single-employee/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  EmployeeControllers.getEmployeeById
);

// DELETE A EMPLOYEE BY ID
router.delete(
  "/delete-employee/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  EmployeeControllers.deleteEmployeeById
);

// UPDATE A EMPLOYEE BY ID
router.patch(
  "/update-employee/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(EmployeeValidation.editEmployeeZodSchema),
  EmployeeControllers.updateEmployeeById
);

export const EmployeeRoutes = router;
