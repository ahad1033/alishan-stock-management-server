import { z } from "zod";

const createProductZodSchema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().optional(),
  sku: z.string().nonempty("SKU is required"),
  price: z
    .number()
    .int("Price must be an integer")
    .positive("Price number must be positive"),
  currentStock: z
    .number()
    .int("Current stock must be an integer")
    .positive("Current stock number must be positive"),
  isDeleted: z.boolean().optional(),
});

const editProductZodSchema = z.object({
  name: z.string().nonempty("Name is required").optional(),
  description: z.string().nonempty("Description is required").optional(),
  sku: z.string().optional(),
  price: z
    .number()
    .int("Price number must be an integer")
    .positive("Price number must be positive")
    .optional(),
  currentStock: z
    .number()
    .int("Current stock must be an integer")
    .positive("Current stock number must be positive")
    .optional(),
  isDeleted: z.boolean().optional(),
});

export const ProductValidation = {
  editProductZodSchema,
  createProductZodSchema,
};
