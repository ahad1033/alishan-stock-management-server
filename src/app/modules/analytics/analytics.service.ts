import { startOfDay, subDays } from "date-fns";

import { Invoice } from "../invoice/invoice.model";
import { Expense } from "../expense/expense.model";

const getSalesSummary = async () => {
  try {
    const fromDate = subDays(startOfDay(new Date()), 14);

    const sales = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%d %b", date: "$createdAt" },
          },
          sell: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          sell: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    return sales;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to get sales summary!");
    }
  }
};

const getRecentExpensesAnalytics = async () => {
  try {
    const expenses = await Expense.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("issuedBy", "name")
      .lean();

    const formatted = expenses.map((expense) => ({
      id: expense._id.toString(),
      createdAt: expense.createdAt,
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      description: expense.description,
      issuedBy: expense.issuedBy,
    }));

    return formatted;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to get recent expenses analytics!");
    }
  }
};

export const AnalyticsServices = {
  getSalesSummary,
  getRecentExpensesAnalytics,
};
