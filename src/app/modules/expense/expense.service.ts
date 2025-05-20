import mongoose from "mongoose";

import { Expense } from "./expense.model";
import { IExpense } from "./expense.interface";
import { Balance } from "../balance/balance.model";

const addExpense = async (expenseData: IExpense, issuedBy: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

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

    // 1. Save the expense
    const expense = new Expense(expenseData);
    const savedExpense = await expense.save({ session });

    // 2. Update balance
    const balance = await Balance.findOne().session(session);

    if (!balance) {
      throw new Error(
        "Balance record not found. Please create an invoice first."
      );
    }

    const amount = Number(expenseData.amount);
    balance.totalExpense += amount;
    balance.currentBalance -= amount;

    if (balance.currentBalance < 0) {
      throw new Error("Not enough balance to cover this expense.");
    }

    await balance.save({ session });

    // 3. Commit transaction
    await session.commitTransaction();
    session.endSession();

    return savedExpense;
  } catch (error: unknown) {
    await session.abortTransaction();
    session.endSession();

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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const expense = await Expense.findById(id).session(session);

    if (!expense) {
      throw new Error("Expense not found");
    }

    const oldAmount = expense.amount;

    // ✅ Ensure salary category includes employeeId
    if (expense.category === "salary") {
      if (
        expenseData.employeeId === undefined ||
        expenseData.employeeId === null
      ) {
        throw new Error("Employee ID is required for salary expenses");
      }
    } else {
      expense.employeeId = undefined;
    }

    // ✅ Update allowed fields
    const allowedFields: (keyof IExpense)[] = ["date", "description", "amount"];
    allowedFields.forEach((field) => {
      if (expenseData[field] !== undefined) {
        (expense as any)[field] = expenseData[field];
      }
    });

    // ✅ Save updated expense
    const updatedExpense = await expense.save({ session });

    // ✅ Update Balance
    const balance = await Balance.findOne().session(session);
    if (!balance) {
      throw new Error("Balance record not found.");
    }

    const newAmount = updatedExpense.amount;
    const diff = newAmount - oldAmount;

    balance.totalExpense += diff;
    balance.currentBalance -= diff;

    if (balance.currentBalance < 0) {
      throw new Error("Not enough balance for updated expense.");
    }

    await balance.save({ session });

    await session.commitTransaction();
    session.endSession();

    return updatedExpense;
  } catch (error: unknown) {
    await session.abortTransaction();
    session.endSession();

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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const expense = await Expense.findById(id).session(session);
    if (!expense) {
      throw new Error("Expense not found");
    }

    if (expense.isDeleted) {
      throw new Error("Expense already deleted");
    }

    // Mark as soft deleted
    expense.isDeleted = true;
    await expense.save({ session });

    // Update Balance
    const balance = await Balance.findOne().session(session);
    if (!balance) {
      throw new Error("Balance record not found");
    }

    balance.totalExpense -= expense.amount;
    balance.currentBalance += expense.amount;

    await balance.save({ session });

    await session.commitTransaction();
    session.endSession();

    return expense;
  } catch (error: unknown) {
    await session.abortTransaction();
    session.endSession();

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
