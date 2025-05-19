import { model, Schema } from "mongoose";

const expenseSchema = new Schema(
  {
    date: { type: String, required: true },
    category: {
      type: String,
      enum: ["salary", "material", "utility", "rent", "maintenance", "other"],
    },
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee" },
    issuedBy: { type: Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    amount: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Add a virtual `id` field
expenseSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Expense = model("Expense", expenseSchema);
