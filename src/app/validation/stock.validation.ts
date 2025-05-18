import { z } from "zod";

import { Types } from "mongoose";

// Helper to validate ObjectId strings
const objectIdValidator = z
  .string({ required_error: "ID is required" })
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
  });

// Schema for adding stock (status will be "IN" by default in service)
const addStockZodSchema = z.object({
  body: z.object({
    productId: objectIdValidator,
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
