import { Request, Response } from "express";

import { StockServices } from "./stock.service";

const addStock = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    const issuedBy = req.user.userId;

    const result = await StockServices.addStock(productId, quantity, issuedBy);

    res.status(201).json({
      success: true,
      message: "Stock added successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to add stock",
    });
  }
};

const deductStockByInvoice = async (req: Request, res: Response) => {
  try {
    const { invoiceNumber } = req.body;

    const issuedBy = req.user._id;

    const result = await StockServices.deductStockByInvoice(
      invoiceNumber,
      issuedBy
    );

    res.status(200).json({
      success: true,
      message: "Stock deducted successfully from invoice",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to deduct stock",
    });
  }
};

const getStockHistory = async (_req: Request, res: Response) => {
  try {
    const data = await StockServices.getStockHistory();

    res.status(200).json({
      success: true,
      message: "Stock history retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to retrieve stock history",
    });
  }
};

export const StockControllers = {
  addStock,
  deductStockByInvoice,
  getStockHistory,
};
