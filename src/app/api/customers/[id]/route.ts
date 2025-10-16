import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Customer from "../../../models/Customer";

// Mijozni olish
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    await connectDB();
    const customer = await Customer.findById(id);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Mijoz topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: customer });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Noma’lum xatolik yuz berdi";
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: 400 }
    );
  }
}

// Mijozni yangilash
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    await connectDB();
    const body = await request.json();
    const customer = await Customer.findByIdAndUpdate(id, body, { new: true });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Mijoz topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: customer });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Noma’lum xatolik yuz berdi";
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: 400 }
    );
  }
}

// Mijozni o‘chirish
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    await connectDB();
    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Mijoz topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Noma’lum xatolik yuz berdi";
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: 400 }
    );
  }
}
