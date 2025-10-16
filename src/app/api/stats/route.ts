import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import Customer from "../../models/Customer";
import Phone from "../../models/Phone";

export async function GET() {
  try {
    await connectDB();
    const customers = await Customer.find({});
    const phones = await Phone.find({});

    let totalRevenue = 0;
    let activeContracts = 0;
    let pendingPayments = 0;

    customers.forEach((customer) => {
      customer.contracts.forEach((contract) => {
        if (contract.status === "active") {
          activeContracts++;
          totalRevenue += contract.paidMonths * contract.monthlyPayment;
          pendingPayments +=
            (contract.months - contract.paidMonths) * contract.monthlyPayment;
        }
      });
    });

    const stats = {
      totalCustomers: customers.length,
      activeContracts,
      totalRevenue,
      pendingPayments,
      totalPhones: phones.reduce((sum, phone) => sum + phone.stock, 0),
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Serverda kutilmagan xatolik yuz berdi";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
