import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Customer from "../../../models/Customer";

export async function GET() {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const customers = await Customer.find({
      "contracts.nextPaymentDate": { $gte: today, $lt: tomorrow },
      "contracts.status": "active",
    });

    const payments: {
      customer: string;
      phone: string;
      email: string;
      phoneModel: string;
      amount: number;
      contractId: string;
      customerId: string;
    }[] = [];

    for (const customer of customers) {
      for (const contract of customer.contracts) {
        const contractDate = new Date(contract.nextPaymentDate);
        contractDate.setHours(0, 0, 0, 0);

        if (
          contractDate.getTime() === today.getTime() &&
          contract.status === "active"
        ) {
          payments.push({
            customer: customer.name,
            phone: customer.phone,
            email: customer.email,
            phoneModel: contract.phoneModel,
            amount: contract.monthlyPayment,
            contractId: contract._id?.toString() ?? "",
            customerId: customer._id?.toString(),
          });
        }
      }
    }

    return NextResponse.json({ success: true, data: payments });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Noma’lum xatolik yuz berdi";
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: 500 }
    );
  }
}
