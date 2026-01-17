import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Customer from "../../../models/Customer";

export async function GET() {
  try {
    await connectDB();

    const customers = await Customer.find({ "contracts.0": { $exists: true } });

    const allPayments: any[] = [];

    for (const customer of customers) {
      for (const contract of customer.contracts) {
        if (contract.status === "cancelled") continue;

        // To'langan oylar
        for (let i = 1; i <= contract.paidMonths; i++) {
          const paymentDate = new Date(contract.startDate);
          paymentDate.setMonth(paymentDate.getMonth() + i);
          paymentDate.setDate(contract.paymentDay);

          allPayments.push({
            customer: customer.name,
            phone: customer.phone,
            email: customer.email,
            phoneModel: contract.phoneModel,
            amount: contract.monthlyPayment,
            dueDate: paymentDate.toISOString().split("T")[0],
            status: "paid",
            contractId: contract._id?.toString(),
            customerId: customer._id?.toString(),
          });
        }

        // Kelajakdagi / kutilayotgan to'lovlar
        const remainingMonths = contract.months - contract.paidMonths;
        for (let i = 1; i <= remainingMonths; i++) {
          const due = new Date(contract.nextPaymentDate);
          due.setMonth(due.getMonth() + (i - 1));

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const status = due < today ? "overdue" : "pending";

          allPayments.push({
            customer: customer.name,
            phone: customer.phone,
            email: customer.email,
            phoneModel: contract.phoneModel,
            amount: contract.monthlyPayment,
            dueDate: due.toISOString().split("T")[0],
            status,
            contractId: contract._id?.toString(),
            customerId: customer._id?.toString(),
          });
        }
      }
    }

    // Sana bo'yicha saralash (ixtiyoriy)
    allPayments.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );

    return NextResponse.json({ success: true, data: allPayments });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
