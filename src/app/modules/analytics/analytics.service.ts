import {
  format,
  addDays,
  subDays,
  subMonths,
  startOfDay,
  startOfMonth,
  addMonths,
} from "date-fns";

import { Invoice } from "../invoice/invoice.model";
import { Expense } from "../expense/expense.model";

const getSalesSummary = async () => {
  try {
    const today = startOfDay(new Date());
    const fromDate = subDays(today, 13);

    const rawSales = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: "$createdAt",
              unit: "day",
              timezone: "Asia/Dhaka",
            },
          },
          sell: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Use ISO date string as key for accuracy
    const salesMap = new Map(
      rawSales.map((item) => [format(item._id, "yyyy-MM-dd"), item.sell])
    );

    // Build result with all 14 days, even if sale = 0
    const result: { date: string; sell: number }[] = [];

    for (let i = 0; i < 14; i++) {
      const currentDate = addDays(fromDate, i);
      const key = format(currentDate, "yyyy-MM-dd");
      result.push({
        date: format(currentDate, "dd MMM"),
        sell: salesMap.get(key) || 0,
      });
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to get sales summary!");
    }
  }
};

const getMonthlySalesSummary = async () => {
  try {
    const today = new Date();
    const startMonth = startOfMonth(subMonths(today, 3));

    const rawSales = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: startMonth },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: "$createdAt",
              unit: "month",
              timezone: "Asia/Dhaka",
            },
          },
          sell: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Create map with "yyyy-MM" key
    const salesMap = new Map(
      rawSales.map((item) => [format(item._id, "yyyy-MM"), item.sell])
    );

    const result: { month: string; sell: number }[] = [];

    for (let i = 0; i < 4; i++) {
      const currentMonth = addMonths(startMonth, i);
      const key = format(currentMonth, "yyyy-MM");

      result.push({
        month: format(currentMonth, "MMMM yy"),
        sell: salesMap.get(key) || 0,
      });
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to get monthly sales summary!");
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
  getMonthlySalesSummary,
  getRecentExpensesAnalytics,
};
