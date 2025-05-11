import { model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String},
    sku: { type: String, unique: true },
    currentStock: { type: Number, required: true },
    price: { type: Number, required: true },
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
productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Product = model("Product", productSchema);
