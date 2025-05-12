import express from "express";

import { USER_ROLE } from "../user/user.constant";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "../../validation/auth.validation";
import { authMiddleware } from "../../middlewares/authMiddleware";

import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginTeacherSchema),
  AuthController.loginUser
);

router.post(
  "/change-password",
  authMiddleware(
    USER_ROLE.admin,
    USER_ROLE.accountant,
    USER_ROLE.stock_manager
  ),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken
);

export const AuthRoutes = router;
