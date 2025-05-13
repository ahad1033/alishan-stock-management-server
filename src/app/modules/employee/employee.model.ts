import { model, Schema } from "mongoose";

const employeeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    position: {
      type: String,
      enum: [
        "accountant",
        "junior_sales",
        "senior_sales",
        "stock_manager",
        "junior_worker",
        "senior_worker",
        "managing_director",
      ],
    },
    gender: { type: String, enum: ["male", "female"] },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    monthlySalary: { type: Number, required: true },
    nidNumber: { type: String, required: true },
    joiningDate: { type: String, required: true },
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
employeeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Employee = model("Employee", employeeSchema);
