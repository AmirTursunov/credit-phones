import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Customer from "../../../models/Customer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 🔥 Promise
) {
  try {
    await connectDB();
    const { id } = await params; // 🔥 await
    const customer = await Customer.findById(id);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: customer });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 🔥 Promise
) {
  try {
    await connectDB();
    const { id } = await params; // 🔥 await
    const body = await request.json();

    const customer = await Customer.findByIdAndUpdate(id, body, { new: true });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: customer });
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
    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
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
