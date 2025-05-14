import { z } from "zod";

const createEmployeeZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Employee name is required" }).trim(),
    email: z.string().optional(),
    phone: z.string({ required_error: "Phone is required" }).trim(),
    emergencyContact: z
      .string({ required_error: "Emergency contact is required" })
      .trim(),
    position: z.enum(
      [
        "accountant",
        "junior_sales",
        "senior_sales",
        "stock_manager",
        "junior_worker",
        "senior_worker",
        "managing_director",
      ],
      {
        required_error: "Position is required",
      }
    ),
    gender: z.enum(["male", "female"], {
      required_error: "Gender is required",
    }),
    presentAddress: z
      .string({ required_error: "Present address is required" })
      .trim(),
    permanentAddress: z
      .string({ required_error: "Permanent address is required" })
      .trim(),
    monthlySalary: z
      .number({ required_error: "Monthly salary is required" })
      .int("Monthly salary amount must be an integer")
      .positive("Monthly salary amount must be positive"),

    nidNumber: z
      .string({ required_error: "NID/Birth regestration no. is required" })
      .trim(),
    joiningDate: z
      .string({ required_error: "Joining date is required" })
      .trim(),
    dateOfBirth: z
      .string({ required_error: "Date of birth is required" })
      .trim(),
    isDeleted: z.boolean().optional(),
  }),
});

export const editEmployeeZodSchema = z.object({
  body: z.object({
    name: z.string().trim().optional(),
    email: z.string().optional(),
    phone: z.string().trim().optional(),
    emergencyContact: z.string().trim().optional(),
    position: z
      .enum([
        "accountant",
        "junior_sales",
        "senior_sales",
        "stock_manager",
        "junior_worker",
        "senior_worker",
        "managing_director",
      ])
      .optional()
      .refine((val) => val !== "managing_director", {
        message: "You cannot assign the role 'managing_director' during update",
      }),
    gender: z.enum(["male", "female"]).optional(),
    presentAddress: z.string().trim().optional(),
    permanentAddress: z.string().trim().optional(),
    monthlySalary: z
      .number()
      .int("Monthly salary must be an integer")
      .positive("Monthly salary must be positive")
      .optional(),
    nidNumber: z.string().trim().optional(),
    joiningDate: z.string().trim().optional(),
    dateOfBirth: z.string().trim().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const EmployeeValidation = {
  editEmployeeZodSchema,
  createEmployeeZodSchema,
};
