import mongoose, { Schema, Model } from "mongoose";
import { ICustomer, IContract } from "../types";

const ContractSchema = new Schema<IContract>(
  {
    paymentDay: { type: Number, required: true, min: 1, max: 31 },
    phoneModel: { type: String, required: true },
    price: { type: Number, required: true },
    downPayment: { type: Number, required: true },
    monthlyPayment: { type: Number, required: true },
    months: { type: Number, required: true },
    startDate: { type: Date, required: true },
    nextPaymentDate: { type: Date, required: true },
    paidMonths: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    passport: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    contracts: [ContractSchema],
  },
  { timestamps: true }
);

const Customer: Model<ICustomer> =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>("Customer", CustomerSchema);
export default Customer;
