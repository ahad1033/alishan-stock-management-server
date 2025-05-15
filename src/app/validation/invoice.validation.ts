import { z } from "zod";
import mongoose from "mongoose";

// Helper to check if a value is a valid ObjectId
const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

// Schema for individual invoice product
const invoiceProductSchema = z.object({
  productId: objectId,
  quantity: z
    .number({ required_error: "Quantity is required" })
    .int("Quantity must be an integer")
    .positive("Quantity must be positive"),
  price: z
    .number({ required_error: "Price is required" })
    .int("Price must be an integer")
    .positive("Price must be positive"),
});

const createInvoiceZodSchema = z.object({
  body: z.object({
    customerId: objectId,
    issuesBy: objectId,
    products: z
      .array(invoiceProductSchema, {
        required_error: "At least one product is required",
      })
      .nonempty("At least one product must be added"),
    totalAmount: z
      .number({ required_error: "Total amount is required" })
      .positive("Total amount must be positive"),
    paidAmount: z
      .number({ required_error: "Paid amount is required" })
      .min(0, "Paid amount cannot be negative"),
    dueAmount: z
      .number({ required_error: "Due amount is required" })
      .min(0, "Due amount cannot be negative"),
    isDeleted: z.boolean().optional(),
  }),
});

const editInvoiceZodSchema = z.object({
  body: z.object({
    customerId: objectId.optional(),
    issuesBy: objectId.optional(),
    products: z.array(invoiceProductSchema).optional(),
    totalAmount: z
      .number()
      .positive("Total amount must be positive")
      .optional(),
    paidAmount: z.number().min(0, "Paid amount cannot be negative").optional(),
    dueAmount: z.number().min(0, "Due amount cannot be negative").optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const InvoiceValidation = {
  createInvoiceZodSchema,
  editInvoiceZodSchema,
};
