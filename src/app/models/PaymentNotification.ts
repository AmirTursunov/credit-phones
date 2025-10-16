import mongoose, { Schema, Model } from "mongoose";
import { IPaymentNotification } from "../types";

const PaymentNotificationSchema = new Schema<IPaymentNotification>(
  {
    customerId: { type: String, required: true },
    contractId: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    sent: { type: Boolean, default: false },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

const PaymentNotification: Model<IPaymentNotification> =
  mongoose.models.PaymentNotification ||
  mongoose.model<IPaymentNotification>(
    "PaymentNotification",
    PaymentNotificationSchema
  );
export default PaymentNotification;
