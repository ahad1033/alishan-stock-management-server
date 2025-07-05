import { Request, Response } from "express";
import { AnalyticsServices } from "./analytics.service";

const getSalesSummary = async (_req: Request, res: Response) => {
  try {
    const data = await AnalyticsServices.getSalesSummary();
    res.json({ success: true, data });
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

const getMonthlySalesSummary = async (_req: Request, res: Response) => {
  try {
    const data = await AnalyticsServices.getMonthlySalesSummary();

    res.json({ success: true, data });
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

const getExpenseAnalytics = async (_req: Request, res: Response) => {
  try {
    const data = await AnalyticsServices.getRecentExpensesAnalytics();

    res.status(200).json({ success: true, data });
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

export const AnalyticsControllers = {
  getSalesSummary,
  getExpenseAnalytics,
  getMonthlySalesSummary,
};
