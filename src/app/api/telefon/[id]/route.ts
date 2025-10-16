import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Phone from "../../../models/Phone";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const phone = await Phone.findByIdAndUpdate(params.id, body, { new: true });

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: phone });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Maʼlumotni yangilashda xatolik yuz berdi";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const phone = await Phone.findByIdAndDelete(params.id);

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Oʻchirish jarayonida xatolik yuz berdi";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
