import { ClientSession } from "mongoose";

import { Balance } from "./balance.model";

export const createOrUpdateBalance = async (
  paidAmount: number,
  dueAmount: number,
  session?: ClientSession
) => {
  let balance = await Balance.findOne().session(session || null);

  if (!balance) {
    const [newBalance] = await Balance.create(
      [
        {
          totalPaid: paidAmount,
          totalUnPaid: dueAmount,
          currentBalance: paidAmount,
          totalExpense: 0,
        },
      ],
      { session }
    );
    return newBalance;
  }

  balance.totalPaid += paidAmount;
  balance.totalUnPaid += dueAmount;
  balance.currentBalance += paidAmount;

  await balance.save({ session });
  return balance;
};

const getBalance = async () => {
  try {
    const expenses = await Balance.find();

    return expenses;
  } catch (error: unknown) {
    throw new Error(
      "Failed to retrieve balance: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};

export const BalanceServices = {
  getBalance,
};
