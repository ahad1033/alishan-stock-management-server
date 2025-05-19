import { Types } from "mongoose";

export interface IExpense {
  date: String;
  category:
    | "salary"
    | "material"
    | "utility"
    | "rent"
    | "maintenance"
    | "other";
  employeeId?: Types.ObjectId;
  issuedBy?: Types.ObjectId;
  description?: String;
  amount: Number;
  isDeleted?: Boolean;
}
