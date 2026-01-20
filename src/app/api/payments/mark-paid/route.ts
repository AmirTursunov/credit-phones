import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Customer from "../../../models/Customer";
import mongoose from "mongoose";

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

    if (
      !mongoose.Types.ObjectId.isValid(customerId) ||
      !mongoose.Types.ObjectId.isValid(contractId)
    ) {
      return NextResponse.json(
        { success: false, error: "Noto'g'ri ID formati" },
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
      (c: any) => c._id.toString() === contractId,
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

    // To'lovni qayd etish
    contract.paidMonths += 1;

    // Keyingi to'lov sanasini hisoblash
    const currentNext = new Date(contract.nextPaymentDate);
    currentNext.setMonth(currentNext.getMonth() + 1);
    currentNext.setDate(contract.paymentDay);
    currentNext.setHours(0, 0, 0, 0); // juda muhim!
    currentNext.setMinutes(0);
    currentNext.setSeconds(0);
    currentNext.setMilliseconds(0);

    contract.nextPaymentDate = currentNext;

    // Agar to'liq to'langan bo'lsa
    if (contract.paidMonths >= contract.months) {
      contract.status = "completed";
    }

    await customer.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("mark-paid xatosi:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server xatosi" },
      { status: 500 },
    );
  }
}
