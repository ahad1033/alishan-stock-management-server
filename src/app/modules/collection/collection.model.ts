import { model, Schema } from "mongoose";

const collectionSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    issuedBy: { type: Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["cash", "cheque", "mobile_banking", "bank_transfer"],
    },
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
collectionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Collection = model("Collection", collectionSchema);
