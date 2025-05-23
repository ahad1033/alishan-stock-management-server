import mongoose from "mongoose";
import { z } from "zod";

// Helper to check if a value is a valid ObjectId
const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

export const createCollectionValidationSchema = z.object({
  body: z.object({
    customerId: objectId,
    amount: z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
      })
      .positive("Amount must be a positive number"),
    method: z.enum(["cash", "cheque", "mobile_banking", "bank_transer"], {
      required_error: "Payment method is required",
    }),
    issuedBy: z.string().optional(),
  }),
});

export const CollectionValidation = {
  createCollectionValidationSchema,
};
