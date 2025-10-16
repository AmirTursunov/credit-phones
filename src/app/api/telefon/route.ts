import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import Phone from "../../models/Phone";

export async function GET() {
  try {
    await connectDB();
    const phones = await Phone.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: phones });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const phone = await Phone.create(body);
    return NextResponse.json({ success: true, data: phone }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
