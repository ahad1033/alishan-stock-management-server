import mongoose, { Types } from "mongoose";

import { IStock } from "./stock.interface";
import { Invoice } from "../invoice/invoice.model";
import { Product } from "../product/product.model";
import { Stock } from "./stock.model";

const addStock = async (
  productId: string,
  quantity: number,
  issuedBy: string
) => {
  const product = await Product.findById(productId);

  if (!product) throw new Error("Product not found");

  product.stock += quantity;

  await product.save();

  await Stock.create({
    productId: new Types.ObjectId(productId),
    quantity,
    status: "IN",
    issuedBy: new Types.ObjectId(issuedBy),
  } as IStock);

  return product;
};

const deductStockByInvoice = async (
  invoiceNumber: string,
  issuedBy: string
) => {
  const invoice = await Invoice.findOne({ invoiceNumber }).populate(
    "products.productId"
  );

  if (!invoice) throw new Error("Invoice not found");

  if (invoice.isStockDeducted) throw new Error("Stock already deducted");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const product of invoice.products) {
      const dbProduct = await Product.findById(product.productId._id).session(
        session
      );
      if (!dbProduct) throw new Error("Product not found");

      if (dbProduct.stock < product.quantity) {
        throw new Error(`Insufficient stock for ${dbProduct.name}`);
      }

      dbProduct.stock -= product.quantity;
      dbProduct.reserved = Math.max(
        (dbProduct.reserved || 0) - product.quantity,
        0
      );
      await dbProduct.save();

      await Stock.create(
        [
          {
            productId: product.productId._id,
            quantity: product.quantity,
            status: "out",
            issuedBy,
            invoiceId: invoice._id,
          },
        ],
        { session }
      );
    }

    invoice.isStockDeducted = true;
    
    await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    return invoice;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getStockHistory = async () => {
  return await Stock.find({})
    .populate("productId", "name")
    .populate("issuedBy", "name")
    .sort({ createdAt: -1 });
};

export const StockServices = {
  addStock,
  getStockHistory,
  deductStockByInvoice,
};
