import { Types } from "mongoose";

export interface IStock {
  productId: Types.ObjectId;
  quantity: number;
  status: "IN" | "OUT";
  issuedBy: Types.ObjectId;
  relatedInvoiceId?: Types.ObjectId;
}
