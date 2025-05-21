import { z } from "zod";
import mongoose from "mongoose";

// Helper to validate ObjectId
const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

// Allowed expense categories
const allowedCategories = [
  "salary",
  "material",
  "utility",
  "rent",
  "maintenance",
  "other",
] as const;

const createExpenseZodSchema = z.object({
  body: z.object({
    date: z.string({ required_error: "Date is required" }),
    category: z.enum(allowedCategories, {
      required_error: "Category is required",
    }),
    employeeId: objectId.optional(),
    issuedBy: objectId.optional(),
    description: z.string().optional(),
    amount: z
      .number({ required_error: "Amount is required" })
      .positive("Amount must be a positive number"),
    isDeleted: z.boolean().optional(),
  }),
});

const editExpenseZodSchema = z.object({
  body: z.object({
    date: z.string().optional(),
    employeeId: objectId.optional(),
    issuedBy: objectId.optional(),
    description: z.string().optional(),
    amount: z.number().positive("Amount must be a positive number").optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const ExpenseValidation = {
  createExpenseZodSchema,
  editExpenseZodSchema,
};
