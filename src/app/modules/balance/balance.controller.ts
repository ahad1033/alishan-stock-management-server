import { Request, Response } from "express";
import { BalanceServices } from "./balance.service";

const getBalance = async (req: Request, res: Response) => {
  try {
    const expenses = await BalanceServices.getBalance();

    console.log("expenses :", expenses);

    res.status(200).json({
      success: true,
      message: "Expenses retrieved successfully!",
      data: expenses,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to retrieve expenses",
      error: errorMessage,
    });
  }
};

export const BalanceControllers = {
  getBalance,
};
