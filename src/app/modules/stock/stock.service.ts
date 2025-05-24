import mongoose, { Types } from "mongoose";

import { parseDate } from "../../utils/parseDate";

import { Stock } from "./stock.model";
import { IStock } from "./stock.interface";
import { Invoice } from "../invoice/invoice.model";
import { Product } from "../product/product.model";

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
    status: "in",
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

const getStockHistory = async (queryParams: {
  search?: string;
  fromDate?: string;
  toDate?: string;
}) => {
  try {
    const { search, fromDate, toDate } = queryParams;
    const query: any = {};

    // 🔍 Filter by product name (if search provided)
    if (search) {
      const matchingProducts = await Product.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const matchingProductIds = matchingProducts.map((product) => product._id);
      query.productId = { $in: matchingProductIds };
    }

    // 🗓️ Filter by createdAt range
    const parsedFrom = fromDate ? parseDate(fromDate) : null;
    const parsedTo = toDate ? parseDate(toDate) : null;

    if (parsedFrom || parsedTo) {
      query.createdAt = {};
      if (parsedFrom) query.createdAt.$gte = parsedFrom;
      if (parsedTo) query.createdAt.$lte = parsedTo;
    }

    // 📦 Fetch stock history
    const stockRecords = await Stock.find(query)
      .populate("productId", "name")
      .populate("issuedBy", "name")
      .sort({ createdAt: -1 });

    return stockRecords;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to retrieve stock history: " + error.message);
    } else {
      throw new Error("Failed to retrieve stock history: Unknown error");
    }
  }
};

export const StockServices = {
  addStock,
  getStockHistory,
  deductStockByInvoice,
};
