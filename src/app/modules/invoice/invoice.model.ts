import { model, Schema } from "mongoose";

const invoiceProductSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

const invoiceSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    issuedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: { type: [invoiceProductSchema], required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    dueAmount: { type: Number, required: true },
    invoiceNumber: { type: String, unique: true },
    isStockDeducted: { type: Boolean, default: false },
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
invoiceSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Invoice = model("Invoice", invoiceSchema);
