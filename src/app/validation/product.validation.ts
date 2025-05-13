import { z } from "zod";

const createProductZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).trim(),
    description: z.string().optional(),
    sku: z.string({ required_error: "SKU is required" }).trim(),
    price: z
      .number({ required_error: "Price is required" })
      .int("Price must be an integer")
      .positive("Price must be positive"),
    stock: z
      .number({ required_error: "Stock is required" })
      .int("Stock must be an integer")
      .min(0, "Stock must be 0 or greater"),
    isDeleted: z.boolean().optional(),
  }),
});

const editProductZodSchema = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required").optional(),
    description: z.string().nonempty("Description is required").optional(),
    sku: z.string().optional(),
    price: z
      .number()
      .int("Price number must be an integer")
      .positive("Price number must be positive")
      .optional(),
    stock: z
      .number()
      .int("Current stock must be an integer")
      .positive("Current stock number must be positive")
      .optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const ProductValidation = {
  editProductZodSchema,
  createProductZodSchema,
};
