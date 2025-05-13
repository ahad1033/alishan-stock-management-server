import { z } from "zod";

const createCustomerZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).trim(),
    shopName: z.string({ required_error: "Shop name is required" }).trim(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    totalPurchaseAmount: z
      .number()
      .int("Purchase amount must be an integer")
      .positive("Purchase amount must be positive")
      .optional(),
    totalPaidAmount: z
      .number()
      .int("Paid amount must be an integer")
      .positive("Paid amount must be positive")
      .optional(),
    totalDue: z
      .number()
      .int("Due amount must be an integer")
      .positive("Due amount must be positive")
      .optional(),
    isDeleted: z.boolean().optional(),
  }),
});

const editCustomerZodSchema = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required").optional(),
    shopName: z.string().nonempty("Name is required").optional(),
    address: z.string().nonempty("Address is required").optional(),
    phone: z.string().nonempty("Phone is required").optional(),
    email: z.string().nonempty("Email is required").optional(),
    totalPurchaseAmount: z
      .number()
      .int("Purchase amount must be an integer")
      .positive("Purchase amount must be positive")
      .optional(),
    totalPaidAmount: z
      .number()
      .int("Paid amount must be an integer")
      .positive("Paid amount must be positive")
      .optional(),
    totalDue: z
      .number()
      .int("Due amount must be an integer")
      .positive("Due amount must be positive")
      .optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const CustomerValidation = {
  editCustomerZodSchema,
  createCustomerZodSchema,
};
