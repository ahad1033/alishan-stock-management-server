import { model, Schema } from "mongoose";

const stockSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    type: { type: String, enum: ["in", "out"], required: true },
    issuedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
