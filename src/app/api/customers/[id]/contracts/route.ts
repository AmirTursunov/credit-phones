import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Customer from "../../../../models/Customer";

// Yangi shartnoma qo‘shish
export async function POST(
  request: NextRequest,
  context: { params: { id: string } } // <-- bu yerda Promise olib tashlandi
) {
  try {
    await connectDB();

    const body = await request.json();
    const customer = await Customer.findById(context.params.id); // params.id

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Mijoz topilmadi" },
        { status: 404 }
      );
    }

    customer.contracts.push(body);
    await customer.save();

    return NextResponse.json(
      { success: true, data: customer },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Noma’lum xatolik yuz berdi";
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: 400 }
    );
  }
}
