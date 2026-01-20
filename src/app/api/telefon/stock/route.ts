// app/api/telefon/decrement-stock/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Phone from "../../../models/Phone";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { phoneModel } = await request.json();

    if (!phoneModel) {
      return NextResponse.json(
        { success: false, error: "Telefon modeli kiritilmagan" },
        { status: 400 },
      );
    }

    const phone = await Phone.findOne({ model: phoneModel });

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Telefon topilmadi" },
        { status: 404 },
      );
    }

    if (phone.stock <= 0) {
      return NextResponse.json(
        { success: false, error: "Omborda bu modeldan qolmagan" },
        { status: 400 },
      );
    }

    phone.stock -= 1;
    await phone.save();

    return NextResponse.json({
      success: true,
      data: { model: phone.model, stock: phone.stock },
    });
  } catch (error: any) {
    console.error("Stock kamaytirish xatosi:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server xatosi" },
      { status: 500 },
    );
  }
}
