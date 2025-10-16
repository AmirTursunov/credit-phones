import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Customer from "../../../../models/Customer";

// Yangi shartnoma qo'shish
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 🔥 Promise qo'shildi
) {
  try {
    await connectDB();
    const { id } = await params; // 🔥 await qo'shildi
    const body = await request.json();

    const customer = await Customer.findById(id);
    if (!customer)
      return NextResponse.json(
        { success: false, error: "Topilmadi" },
        { status: 404 }
      );

    customer.contracts.push(body);
    await customer.save();

    return NextResponse.json(
      { success: true, data: customer },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
