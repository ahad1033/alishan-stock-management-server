import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import config from "../config";

import { User } from "../modules/user/user.model";
import { TUserRole } from "../modules/user/user.interface";

export const authMiddleware = (...requiredRoles: TUserRole[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // CHECK IF THE TOKEN IS PRESENT
    if (!token) {
      throw new Error("You are not authorized to access this resource!");
    }

    // CHECK IF THE TOKEN IS VALID
    try {
      const decoded = jwt.verify(token, config.jwt_access_secret) as JwtPayload;

      const role = decoded.role;

      const isUserExist = await User.findOne({
        email: decoded.email,
      });

      if (!isUserExist) {
        throw new Error("User not found");
      }

      // CHECK IF THE USER IS DELETED
      const isDeleted = isUserExist?.isDeleted;

      if (isDeleted) {
        throw new Error("User is deleted");
      }

      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new Error("You are not authorized to access this resource!");
      }

      req.user = decoded;
      next();
    } catch (err) {
      throw new Error("You are not authorized to access this resource!");
    }
  };
};
