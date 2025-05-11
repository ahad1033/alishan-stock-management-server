import express from "express";

import { USER_ROLE } from "./user.constant";
import { UserControllers } from "./user.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { UserValidation } from "../../validation/user.validation";

import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// CREATE A USER
router.post(
  "/create-user",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(UserValidation.createUserZodSchema),
  UserControllers.createUser
);

// GET ALL USERS
router.get(
  "/get-all-user",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  UserControllers.getAllUser
);

// GET A USER BY ID
router.get(
  "/get-single-user/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  UserControllers.getUserById
);

// DELETE A USER BY ID
router.delete(
  "/delete-user/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  UserControllers.deleteUserById
);

// UPDATE A USER BY ID
router.patch(
  "/update-user/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  UserControllers.updateUserById
);

export const UserRoutes = router;
