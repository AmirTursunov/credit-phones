import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Customer from "../../../models/Customer";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { customerId, contractId } = await request.json();

    if (!customerId || !contractId) {
      return NextResponse.json(
        { success: false, error: "customerId va contractId kerak" },
        { status: 400 },
      );
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Mijoz topilmadi" },
        { status: 404 },
      );
    }

    const contract = customer.contracts.find(
      (c) => c._id && c._id.toString() === contractId,
    );
    if (!contract) {
      return NextResponse.json(
        { success: false, error: "Shartnoma topilmadi" },
        { status: 404 },
      );
    }

    if (contract.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Shartnoma faol emas" },
        { status: 400 },
      );
    }

    // Asosiy o'zgarishlar
    contract.paidMonths += 1;

    // Keyingi to'lov sanasini hisoblash
    const nextDate = new Date(contract.startDate);
    nextDate.setMonth(nextDate.getMonth() + contract.paidMonths);
    nextDate.setDate(contract.paymentDay);
    contract.nextPaymentDate = nextDate;

    // Agar hammasi to'langan bo'lsa
    if (contract.paidMonths >= contract.months) {
      contract.status = "completed";
    }

    await customer.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || "Server xatosi" },
      { status: 500 },
    );
  }
}
