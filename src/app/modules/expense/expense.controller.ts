import { Request, Response } from "express";

import { ExpenseServices } from "./expense.service";

const addExpense = async (req: Request, res: Response) => {
  try {
    const expenseData = req.body;

    const issuedBy = req.user.userId;

    const expense = await ExpenseServices.addExpense(expenseData, issuedBy);

    res.status(201).json({
      success: true,
      message: "Expense created successfully!",
      data: expense,
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

const editExpense = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.id;

    const expenseData = req.body;

    const updatedExpense = await ExpenseServices.editExpense(
      expenseId,
      expenseData
    );

    res.status(200).json({
      success: true,
      message: "Expense updated successfully!",
      data: updatedExpense,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to update expense",
      error: errorMessage,
    });
  }
};

const deleteExpense = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.id;

    await ExpenseServices.deleteExpense(expenseId);

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully!",
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete expense",
      error: errorMessage,
    });
  }
};

const getExpense = async (req: Request, res: Response) => {
  try {
    const { search, fromDate, toDate, category } = req.query;

    const expenses = await ExpenseServices.getExpense({
      search: search as string,
      fromDate: fromDate as string,
      toDate: toDate as string,
      category: category as string,
    });

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

const getExpenseById = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.id;

    const expense = await ExpenseServices.getExpenseById(expenseId);

    res.status(200).json({
      success: true,
      message: "Expense retrieved successfully!",
      data: expense,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to retrieve expense",
      error: errorMessage,
    });
  }
};

export const ExpenseControllers = {
  editExpense,
  getExpense,
  addExpense,
  deleteExpense,
  getExpenseById,
};
