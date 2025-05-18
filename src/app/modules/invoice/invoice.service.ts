import mongoose from "mongoose";

import { IInvoice } from "./invoice.interface";

import { Invoice } from "./invoice.model";
import { Product } from "../product/product.model";
import { Customer } from "../customer/customer.model";

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
    const savedInvoice = await invoice.save({ session });

    // Step 3: Update customer's financials
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

    await session.commitTransaction();
    session.endSession();

    return savedInvoice;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to create invoice: " + error.message);
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
  try {
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Step 1: Revert product reserved quantities
    for (const item of invoice.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { reserved: -item.quantity },
      });
    }

    // Revert the customer's totals based on this invoice
    await Customer.findByIdAndUpdate(invoice.customerId, {
      $inc: {
        totalPurchaseAmount: -invoice.totalAmount,
        totalPaidAmount: -invoice.paidAmount,
        totalDue: -invoice.dueAmount,
      },
    });

    // Soft delete the invoice
    invoice.isDeleted = true;
    return await invoice.save();
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
}) => {
  try {
    const { search, fromDate, toDate } = queryParams;

    const query: any = { isDeleted: false };

    // Handle date range filter
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    // Fetch invoices with customer and user name populated
    let invoices = await Invoice.find(query)
      .populate("customerId", "name")
      .populate("issuedBy", "name")
      .lean();

    // Optional search filtering (by invoice number or customer name)
    if (search) {
      const lowerSearch = search.toLowerCase();
      invoices = invoices.filter((inv) => {
        const customer = inv.customerId as { name?: string };
        return (
          inv.invoiceNumber?.toLowerCase().includes(lowerSearch) ||
          customer?.name?.toLowerCase().includes(lowerSearch)
        );
      });
    }

    // Transform result: expose names as `customerName` and `issuedBy`
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
    const invoice = await Invoice.findById(id);

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
