import express from "express";

import { USER_ROLE } from "../user/user.constant";

import { CollectionControllers } from "./collection.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { CollectionValidation } from "../../validation/collection.validation";

import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// CREATE A COLLECTION
router.post(
  "/create-collection",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  validateRequest(CollectionValidation.createCollectionValidationSchema),
  CollectionControllers.createCollection
);

// GET ALL COLLECTION
router.get(
  "/get-collection-history",
  authMiddleware(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.accountant),
  CollectionControllers.getCollection
);

export const CollectionRoutes = router;
