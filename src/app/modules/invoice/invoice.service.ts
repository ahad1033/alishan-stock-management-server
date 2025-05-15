import mongoose from "mongoose";

import { Invoice } from "./invoice.model";
import { IInvoice } from "./invoice.interface";

const createInvoice = async (invoiceData: IInvoice) => {
  try {
    // Find the latest invoice by createdAt or invoiceNumber
    const lastInvoice = await Invoice.findOne({}).sort({ invoiceNumber: -1 });

    let nextInvoiceNumber = 1;

    if (lastInvoice && lastInvoice.invoiceNumber) {
      nextInvoiceNumber = Number(lastInvoice.invoiceNumber) + 1;
    }

    // Assign the new invoice number
    invoiceData.invoiceNumber = nextInvoiceNumber.toString().padStart(5, "0");

    const invoice = new Invoice(invoiceData);

    return await invoice.save();
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
  try {
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Update invoice data
    Object.assign(invoice, invoiceData);

    return await invoice.save();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to edit invoice: " + error.message);
    } else if (error instanceof mongoose.Error.ValidationError) {
      throw new Error("Validation error: " + error.message);
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

    // Soft delete by setting isDelete to true
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
  editInvoice,
  getInvoice,
  deleteInvoice,
  createInvoice,
  getInvoiceById,
};
