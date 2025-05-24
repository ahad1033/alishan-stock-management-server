import { Types } from "mongoose";

export interface ICollection {
  customerId: Types.ObjectId;
  amount: number;
  description?: string;
  method: "cash" | "cheque" | "mobile_banking" | "bank_transer";
  issuedBy?: Types.ObjectId;
}
