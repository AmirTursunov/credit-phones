import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Customer from "../../../../../models/Customer";

// Shartnomani yangilash
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; contractId: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const customer = await Customer.findById(params.id);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Mijoz topilmadi" },
        { status: 404 }
      );
    }

    const contractIndex = customer.contracts.findIndex(
      (contract) => contract._id?.toString() === params.contractId
    );

    if (contractIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Shartnoma topilmadi" },
        { status: 404 }
      );
    }

    customer.contracts[contractIndex] = {
      ...customer.contracts[contractIndex],
      ...body,
      _id: customer.contracts[contractIndex]._id, // ID ni saqlab qolish
    };

    await customer.save();

    return NextResponse.json({
      success: true,
      data: customer.contracts[contractIndex],
    });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Noma’lum xatolik yuz berdi";
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: 400 }
    );
  }
}

// Shartnomani o‘chirish
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; contractId: string } }
) {
  try {
    await connectDB();
    const customer = await Customer.findById(params.id);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Mijoz topilmadi" },
        { status: 404 }
      );
    }

    const contractIndex = customer.contracts.findIndex(
      (contract) => contract._id?.toString() === params.contractId
    );

    if (contractIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Shartnoma topilmadi" },
        { status: 404 }
      );
    }

    customer.contracts.splice(contractIndex, 1);
    await customer.save();

    return NextResponse.json({
      success: true,
      message: "Shartnoma o‘chirildi",
    });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Noma’lum xatolik yuz berdi";
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: 400 }
    );
  }
}

// Bitta shartnomani olish
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; contractId: string } }
) {
  try {
    await connectDB();
    const customer = await Customer.findById(params.id);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Mijoz topilmadi" },
        { status: 404 }
      );
    }

    const contract = customer.contracts.find(
      (contract) => contract._id?.toString() === params.contractId
    );

    if (!contract) {
      return NextResponse.json(
        { success: false, error: "Shartnoma topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contract });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Noma’lum xatolik yuz berdi";
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: 400 }
    );
  }
}
