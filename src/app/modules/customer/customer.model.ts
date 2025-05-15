import { model, Schema } from "mongoose";

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    shopName: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    totalPurchaseAmount: { type: Number, default: 0 },
    totalPaidAmount: { type: Number, default: 0 },
    totalDue: { type: Number, default: 0 },
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
customerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Customer = model("Customer", customerSchema);
