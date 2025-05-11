import { AnyZodObject, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod error messages
        const errors = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      } else {
        next(error);
      }
    }
  };

export default validateRequest;
