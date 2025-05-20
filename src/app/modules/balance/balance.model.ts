import { model, Schema } from "mongoose";

const balanceSchema = new Schema(
  {
    currentBalance: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    totalUnPaid: { type: Number, default: 0 },
    totalExpense: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add a virtual `id` field
balanceSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Balance = model("Balance", balanceSchema);
