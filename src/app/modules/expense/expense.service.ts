import mongoose from "mongoose";

import { Expense } from "./expense.model";
import { IExpense } from "./expense.interface";

const addExpense = async (expenseData: IExpense, issuedBy: string) => {
  try {
    expenseData.issuedBy = new mongoose.Types.ObjectId(issuedBy);

    // Ensure that salary category must include employeeId
    if (expenseData.category === "salary") {
      if (!expenseData.employeeId) {
        throw new Error("Employee ID is required for salary expenses");
      }
    } else {
      // If not salary, clear employeeId (optional logic)
      expenseData.employeeId = undefined;
    }

    // Create and save the expense
    const expense = new Expense(expenseData);

    return await expense.save();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to create expense: " + error.message);
    } else if (error instanceof mongoose.Error.ValidationError) {
      throw new Error("Validation error: " + error.message);
    } else {
      throw new Error("Failed to create expense: Unknown error");
    }
  }
};

const editExpense = async (id: string, expenseData: Partial<IExpense>) => {
  try {
    const expense = await Expense.findById(id);

    if (!expense) {
      throw new Error("Expense not found");
    }

    // ✅ Ensure employeeId stays intact if category is "salary"
    if (expense.category === "salary") {
      // If someone tries to remove employeeId, block it
      if (
        expenseData.employeeId === undefined ||
        expenseData.employeeId === null
      ) {
        throw new Error("Employee ID is required for salary expenses");
      }
    } else {
      // If not salary, employeeId shuld not be saved
      expense.employeeId = undefined;
    }

    // ✅ Update allowed fields only
    const allowedFields: (keyof IExpense)[] = ["date", "description", "amount"];
    allowedFields.forEach((field) => {
      if (expenseData[field] !== undefined) {
        (expense as any)[field] = expenseData[field];
      }
    });

    return await expense.save();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to edit expense: " + error.message);
    } else if (error instanceof mongoose.Error.ValidationError) {
      throw new Error("Validation error: " + error.message);
    } else {
      throw new Error("Failed to edit expense: Unknown error");
    }
  }
};

const deleteExpense = async (id: string) => {
  try {
    const expense = await Expense.findById(id);

    if (!expense) {
      throw new Error("Expense not found");
    }

    // Soft delete by setting isDelete to true
    expense.isDeleted = true;

    return await expense.save();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to delete expense: " + error.message);
    } else {
      throw new Error("Failed to delete expense: Unknown error");
    }
  }
};

const getExpense = async (classParam?: string) => {
  try {
    const query: any = { isDeleted: false };

    if (classParam) {
      query.category = classParam;
    }

    const expenses = await Expense.find(query)
      .populate("employeeId", "name")
      .populate("issuedBy", "name")
      .lean();

    // Now return each expense with extracted names
    return expenses.map((expense) => {
      const employee = expense.employeeId as { name?: string };
      const user = expense.issuedBy as { name?: string };

      return {
        ...expense,
        employeeName: employee?.name || null,
        issuedByName: user?.name || null,
      };
    });
  } catch (error: unknown) {
    throw new Error(
      "Failed to retrieve expenses: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};

const getExpenseById = async (id: string) => {
  try {
    const expense = await Expense.findById(id)
      .populate("employeeId", "name")
      .populate("issuedBy", "name")
      .lean();

    if (!expense || expense.isDeleted) {
      throw new Error("Expense not found");
    }

    const employee = expense.employeeId as { name?: string };
    const user = expense.issuedBy as { name?: string };

    return {
      ...expense,
      employeeName: employee?.name || null,
      issuedByName: user?.name || null,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to retrieve expense: " + error.message);
    } else {
      throw new Error("Failed to retrieve expense: Unknown error");
    }
  }
};

export const ExpenseServices = {
  getExpense,
  addExpense,
  editExpense,
  deleteExpense,
  getExpenseById,
};
