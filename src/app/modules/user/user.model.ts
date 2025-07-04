import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    password: { type: String, required: true, select: 0 },
    passChangedAt: { type: Date },
    role: {
      type: String,
      enum: ["super_admin", "admin", "accountant", "stock_manager"],
    },
    gender: { type: String, enum: ["male", "female"] },
    phone: { type: String },
    address: { type: String },
    needPassChange: { type: Boolean, default: true },
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
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const User = model("User", userSchema);
