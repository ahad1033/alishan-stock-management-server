import { z } from "zod";

// ZOD SCHEMA FOR CREATING A USER
const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email"),
    image: z.string().optional(),
    password: z.string({ required_error: "Password is required" }),
    role: z.enum(["admin", "accountant", "stock_manager"], {
      required_error: "Role is required",
    }),
    gender: z.enum(["male", "female"], {
      required_error: "Gender is required",
    }),
    phone: z.string({ required_error: "Phone is required" }),
    address: z.string().optional(),
    needPassChange: z.boolean().optional(),
  }),
});

// ZOD SCHEMA FOR EDITING A USER
const editUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email").optional(),
    image: z.string().optional(),
    password: z.string().optional(),
    role: z
      .enum(["admin", "accountant", "stock_manager"], {
        invalid_type_error: "Invalid role",
      })
      .optional(),
    gender: z
      .enum(["male", "female"], {
        invalid_type_error: "Invalid gender",
      })
      .optional(),
    phone: z
      .string()
      .optional()
      .refine((val) => val === undefined || val.length > 0, {
        message: "Phone is required if provided",
      }),
    address: z.string().optional(),
    needPassChange: z.boolean().optional(),
  }),
});

// ZOD SCHEMA FOR TEACHER LOGIN
const loginZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email"),
    password: z.string({ required_error: "Password is required" }),
  }),
});

export const UserValidation = {
  loginZodSchema,
  editUserZodSchema,
  createUserZodSchema,
};
