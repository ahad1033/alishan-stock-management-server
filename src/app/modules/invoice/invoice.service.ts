import mongoose from "mongoose";

import { IInvoice } from "./invoice.interface";

import { parseDate } from "../../utils/parseDate";

import { Invoice } from "./invoice.model";
import { Balance } from "../balance/balance.model";
import { Product } from "../product/product.model";
import { Customer } from "../customer/customer.model";
import { createOrUpdateBalance } from "../balance/balance.service";

const createInvoice = async (invoiceData: IInvoice) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Generate next invoice number
    const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
    let nextInvoiceNumber = 1;

    if (lastInvoice?.invoiceNumber) {
      nextInvoiceNumber = Number(lastInvoice.invoiceNumber) + 1;
    }

    invoiceData.invoiceNumber = nextInvoiceNumber.toString().padStart(5, "0");

    // Step 2: Create and save invoice
    const invoice = new Invoice(invoiceData);
    await invoice.save({ session });

    // Step 3: Populate customer data
    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate("customerId")
      .populate("products.productId", "name price stock reserved")
      .session(session)
      .lean();

    // Step 4: Update customer's financials
    const { customerId, totalAmount, paidAmount, dueAmount } = invoiceData;
    await Customer.findByIdAndUpdate(
      customerId,
      {
        $inc: {
          totalPurchaseAmount: totalAmount,
          totalPaidAmount: paidAmount,
          totalDue: dueAmount,
        },
      },
      { session }
    );

    // Step 4: Update product reserved quantities
    for (const item of invoiceData.products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { reserved: item.quantity } },
        { session }
      );
    }

    // Step 5: Create or update balance
    await createOrUpdateBalance(paidAmount, dueAmount, session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return populatedInvoice;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else if (error instanceof mongoose.Error.ValidationError) {
      throw new Error("Validation error: " + error.message);
    } else {
      throw new Error("Failed to create invoice: Unknown error");
    }
  }
};

const editInvoice = async (id: string, invoiceData: Partial<IInvoice>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingInvoice = await Invoice.findById(id);

    if (!existingInvoice) {
      throw new Error("Invoice not found");
    }

    // Step 1: Revert old reserved quantities
    for (const item of existingInvoice.products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { reserved: -item.quantity } },
        { session }
      );
    }

    // Revert old values from customer totals
    await Customer.findByIdAndUpdate(
      existingInvoice.customerId,
      {
        $inc: {
          totalPurchaseAmount: -existingInvoice.totalAmount,
          totalPaidAmount: -existingInvoice.paidAmount,
          totalDue: -existingInvoice.dueAmount,
        },
      },
      { session }
    );

    // Revert from balance
    const balance = await Balance.findOne().session(session);
    if (!balance) throw new Error("Balance record not found");

    balance.totalPaid -= existingInvoice.paidAmount;
    balance.totalUnPaid -= existingInvoice.dueAmount;
    balance.currentBalance -= existingInvoice.paidAmount;

    // Step 3: Update invoice
    Object.assign(existingInvoice, invoiceData);
    const updatedInvoice = await existingInvoice.save({ session });

    // Step 4: Apply new reserved quantities
    for (const item of updatedInvoice.products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { reserved: item.quantity } },
        { session }
      );
    }

    // Step 5: Update customer totals
    await Customer.findByIdAndUpdate(
      updatedInvoice.customerId,
      {
        $inc: {
          totalPurchaseAmount: updatedInvoice.totalAmount,
          totalPaidAmount: updatedInvoice.paidAmount,
          totalDue: updatedInvoice.dueAmount,
        },
      },
      { session }
    );

    // Step 6: Apply updated values
    balance.totalPaid += updatedInvoice.paidAmount;
    balance.totalUnPaid += updatedInvoice.dueAmount;
    balance.currentBalance += updatedInvoice.paidAmount;

    await balance.save({ session });

    await session.commitTransaction();
    session.endSession();

    return updatedInvoice;
  } catch (error: unknown) {
    if (error instanceof Error) {
      await session.abortTransaction();

      session.endSession();

      throw new Error("Failed to edit invoice: " + error.message);
    } else {
      throw new Error("Failed to edit invoice: Unknown error");
    }
  }
};

const deleteInvoice = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invoice = await Invoice.findById(id).session(session);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Step 1: Revert product reserved quantities
    for (const item of invoice.products) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: { reserved: -item.quantity },
        },
        { session }
      );
    }

    // Revert the customer's totals based on this invoice
    await Customer.findByIdAndUpdate(
      invoice.customerId,
      {
        $inc: {
          totalPurchaseAmount: -invoice.totalAmount,
          totalPaidAmount: -invoice.paidAmount,
          totalDue: -invoice.dueAmount,
        },
      },
      { session }
    );

    //  Revert balance changes
    const balance = await Balance.findOne().session(session);
    if (!balance) throw new Error("Balance record not found");

    balance.totalPaid -= invoice.paidAmount;
    balance.totalUnPaid -= invoice.dueAmount;
    balance.currentBalance -= invoice.paidAmount;

    await balance.save({ session });

    // Soft delete the invoice
    invoice.isDeleted = true;
    const deletedInvoice = await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    return deletedInvoice;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to delete invoice: " + error.message);
    } else {
      throw new Error("Failed to delete invoice: Unknown error");
    }
  }
};

const getInvoice = async (queryParams: {
  search?: string;
  fromDate?: string;
  toDate?: string;
  invoiceNumber?: string;
}) => {
  try {
    const { search, fromDate, toDate, invoiceNumber } = queryParams;

    // If invoiceNumber is provided, handle exact match and return single invoice
    if (invoiceNumber) {
      const trimmedInvoice = invoiceNumber.trim();

      // Optional: Add a regex check if you want to ensure it's only digits
      if (!/^\d+$/.test(trimmedInvoice)) {
        throw new Error("Invalid invoice number format");
      }

      const invoice = await Invoice.findOne({
        isDeleted: false,
        invoiceNumber: trimmedInvoice,
      })
        .populate("customerId", "name")
        .populate("issuedBy", "name")
        .lean();

      if (!invoice) return [];

      const customer = invoice.customerId as { name?: string };
      const user = invoice.issuedBy as { name?: string };

      return [
        {
          ...invoice,
          customerName: customer?.name || "Unknown",
          issuedBy: user?.name || "Unknown",
        },
      ];
    }

    // General query (search, date filter, etc.)
    const query: any = { isDeleted: false };

    if (fromDate || toDate) {
      query.createdAt = {};

      const parsedFrom = fromDate ? parseDate(fromDate) : null;
      const parsedTo = toDate ? parseDate(toDate) : null;

      if (parsedFrom) query.createdAt.$gte = parsedFrom;
      if (parsedTo) query.createdAt.$lte = parsedTo;
    }

    let invoices = await Invoice.find(query)
      .populate("customerId", "name")
      .populate("issuedBy", "name")
      .lean()
      .sort({ createdAt: -1 });

    // Apply search only if invoiceNumber is not provided
    if (search) {
      const lowerSearch = search.toLowerCase();
      invoices = invoices.filter((inv) => {
        const customer = inv.customerId as { name?: string };
        const invoiceNumStr = String(inv.invoiceNumber);

        return (
          invoiceNumStr.includes(lowerSearch) ||
          customer?.name?.toLowerCase().includes(lowerSearch)
        );
      });
    }

    const transformedInvoices = invoices.map((inv) => {
      const customer = inv.customerId as { name?: string };
      const user = inv.issuedBy as { name?: string };

      return {
        ...inv,
        customerName: customer?.name || "Unknown",
        issuedBy: user?.name || "Unknown",
      };
    });

    return transformedInvoices;
  } catch (error: unknown) {
    throw new Error(
      "Failed to retrieve invoices: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};

const getInvoiceById = async (id: string) => {
  try {
    const invoice = await Invoice.findById(id)
      .populate("customerId", "name")
      .populate("issuedBy", "name")
      .populate("products.productId");

    if (!invoice || invoice.isDeleted) {
      throw new Error("Invoice not found");
    }

    return invoice;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to retrieve invoice: " + error.message);
    } else {
      throw new Error("Failed to retrieve invoice: Unknown error");
    }
  }
};

export const InvoiceServices = {
  getInvoice,
  editInvoice,
  deleteInvoice,
  createInvoice,
  getInvoiceById,
};
