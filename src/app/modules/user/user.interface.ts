import { USER_ROLE } from "./user.constant";

export interface IUser {
  name: string;
  email: string;
  password: string;
  passChangedAt?: Date;
  role: "super_admin" | "admin" | "accountant" | "stock_manager";
  gender: "male" | "female";
  phone: string;
  address?: string;
  needPassChange?: boolean;
  isDeleted?: boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
