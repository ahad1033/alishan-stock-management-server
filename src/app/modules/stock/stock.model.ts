import { model, Schema } from "mongoose";

const stockSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ["in", "out"] },
    issuedBy: { type: Schema.Types.ObjectId, ref: "User" },
    relatedInvoiceId: { type: Schema.Types.ObjectId, ref: "Invoice" },
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
stockSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Stock = model("Stock", stockSchema);
