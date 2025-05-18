import { Types } from "mongoose";

export interface IStock {
  productId: Types.ObjectId;
  quantity: number;
  status: "in" | "out";
  issuedBy: Types.ObjectId;
  relatedInvoiceId?: Types.ObjectId;
}
