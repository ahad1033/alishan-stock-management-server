import express from "express";

import { USER_ROLE } from "../user/user.constant";
import { BalanceControllers } from "./balance.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

// GET BALANCE
router.get(
  "/get-balance",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  BalanceControllers.getBalance
);

export const BalanceRoutes = router;
