// src/app/modules/balance/balance.seed.ts
import { Balance } from "./balance.model";

export const seedBalance = async () => {
  const existingBalance = await Balance.findOne();

  if (!existingBalance) {
    await Balance.create({
      totalPaid: 0,
      totalUnPaid: 0,
      currentBalance: 0,
      totalExpense: 0,
    });
    console.log("💰 Initial balance document created.");
  } else {
    console.log("ℹ️ Balance document already exists.");
  }
};
