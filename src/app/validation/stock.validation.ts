import { z } from "zod";

import mongoose from "mongoose";

// Helper to check if a value is a valid ObjectId
const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

// Schema for adding stock (status will be "IN" by default in service)
const addStockZodSchema = z.object({
  body: z.object({
    productId: objectId,
    quantity: z
      .number({ required_error: "Quantity is required" })
      .int("Quantity must be an integer")
      .positive("Quantity must be a positive number"),
  }),
});

// Schema for deducting stock via invoice number
const deductStockZodSchema = z.object({
  body: z.object({
    invoiceNumber: z
      .string({ required_error: "Invoice number is required" })
      .trim()
      .min(1, "Invoice number cannot be empty"),
  }),
});

export const StockValidation = {
  addStockZodSchema,
  deductStockZodSchema,
};
