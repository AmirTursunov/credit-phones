import mongoose, { Schema, Model } from "mongoose";
import { IPhone } from "../types";

const PhoneSchema = new Schema<IPhone>(
  {
    model: { type: String, required: true },
    memory: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Phone: Model<IPhone> =
  mongoose.models.Phone || mongoose.model<IPhone>("Phone", PhoneSchema);
export default Phone;
