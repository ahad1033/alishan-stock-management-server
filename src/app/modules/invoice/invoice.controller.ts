import { Request, Response } from "express";
import { InvoiceServices } from "./invoice.service";

const createInvoice = async (req: Request, res: Response) => {
  try {
    const invoiceData = req.body;

    const invoice = await InvoiceServices.createInvoice(invoiceData);

    res.status(201).json({
      success: true,
      message: "Invoice created successfully!",
      data: invoice,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: errorMessage,
    });
  }
};

const editInvoice = async (req: Request, res: Response) => {
  try {
    const invoiceId = req.params.id;

    const invoiceData = req.body;

    const updatedInvoice = await InvoiceServices.editInvoice(
      invoiceId,
      invoiceData
    );

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully!",
      data: updatedInvoice,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to update invoice",
      error: errorMessage,
    });
  }
};

const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const invoiceId = req.params.id;

    await InvoiceServices.deleteInvoice(invoiceId);

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully!",
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete invoice",
      error: errorMessage,
    });
  }
};

const getInvoice = async (req: Request, res: Response) => {
  try {
    const { search, fromDate, toDate } = req.query;

    const invoices = await InvoiceServices.getInvoice({
      search: search as string,
      fromDate: fromDate as string,
      toDate: toDate as string,
    });

    res.status(200).json({
      success: true,
      message: "Invoices retrieved successfully!",
      data: invoices,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to retrieve invoices",
      error: errorMessage,
    });
  }
};

const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const invoiceId = req.params.id;

    const invoice = await InvoiceServices.getInvoiceById(invoiceId);

    res.status(200).json({
      success: true,
      message: "Invoice retrieved successfully!",
      data: invoice,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to retrieve invoice",
      error: errorMessage,
    });
  }
};

export const InvoiceControllers = {
  editInvoice,
  getInvoice,
  createInvoice,
  deleteInvoice,
  getInvoiceById,
};
