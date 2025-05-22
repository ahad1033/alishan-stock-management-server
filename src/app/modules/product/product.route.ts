import express from "express";

import { USER_ROLE } from "../user/user.constant";
import { ProductControllers } from "./product.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { ProductValidation } from "../../validation/product.validation";

import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// CREATE A PRODUCT
router.post(
  "/create-product",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(ProductValidation.createProductZodSchema),
  ProductControllers.createProduct
);

// EDIT A PRODUCTS
router.patch(
  "/edit-product/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  validateRequest(ProductValidation.editProductZodSchema),
  ProductControllers.editProduct
);

// DELETE A PRODUCTS
router.delete(
  "/delete-product/:id",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin),
  ProductControllers.deleteProduct
);

// GET ALL PRODUCTS
router.get(
  "/get-all-product",
  authMiddleware(
    USER_ROLE.super_admin,
    USER_ROLE.admin,
    USER_ROLE.accountant,
    USER_ROLE.stock_manager
  ),
  ProductControllers.getProducts
);

// GET A PRODUCTS BY ID
router.get(
  "/get-single-product/:id",
  authMiddleware(
    USER_ROLE.super_admin,
    USER_ROLE.admin,
    USER_ROLE.accountant,
    USER_ROLE.stock_manager
  ),
  ProductControllers.getProductById
);

export const ProductRoutes = router;
