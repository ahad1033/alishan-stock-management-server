import { model, Schema } from "mongoose";

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    shopName: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    totalPurchaseAmount: { type: Number },
    totalPaidAmount: { type: Number },
    totaldue: { type: Number },
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
