import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Phone from "../../../models/Phone";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 🔥 Promise
) {
  try {
    await connectDB();
    const { id } = await params; // 🔥 await
    const body = await request.json();

    const phone = await Phone.findByIdAndUpdate(id, body, { new: true });

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: phone });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 🔥 Promise
) {
  try {
    await connectDB();
    const { id } = await params; // 🔥 await
    const phone = await Phone.findByIdAndDelete(id);

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
