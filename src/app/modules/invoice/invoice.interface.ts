import { Types } from "mongoose";

interface ICustomerPopulated {
  _id: Types.ObjectId;
  name: string;
}

export interface IInvoiceProduct {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IInvoice {
  customerId: Types.ObjectId | ICustomerPopulated;
  issuesBy: Types.ObjectId;
  products: IInvoiceProduct[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  invoiceNumber?: string;
  isStockDeducted?: Boolean,
  isDeleted?: Boolean;
}
