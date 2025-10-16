import { NextRequest, NextResponse } from "next/server";
import { sendPaymentReminder } from "../../lib/email";
import PaymentNotification from "../../models/PaymentNotification";
import connectDB from "../../lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const {
      customerEmail,
      customerName,
      phoneModel,
      amount,
      paymentDate,
      customerId,
      contractId,
    } = await request.json();
    const result = await sendPaymentReminder(
      customerEmail,
      customerName,
      phoneModel,
      amount,
      paymentDate
    );
    if (result.success) {
      await PaymentNotification.create({
        customerId,
        contractId,
        paymentDate: new Date(paymentDate),
        amount,
        sent: true,
        sentAt: new Date(),
      });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
