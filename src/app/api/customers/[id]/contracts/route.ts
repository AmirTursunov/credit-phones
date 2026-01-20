// app/api/customers/[id]/contracts/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Customer from "../../../../models/Customer";
import Phone from "../../../../models/Phone";
import mongoose from "mongoose";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  let phoneToRevert: any = null; // rollback uchun

  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Noto'g'ri mijoz ID formati" },
        { status: 400 },
      );
    }

    const body = await request.json();

    // Majburiy fieldlarni tekshirish
    const requiredFields = [
      "phoneModel",
      "price",
      "downPayment",
      "monthlyPayment",
      "months",
      "paymentDay",
      "startDate",
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === "") {
        return NextResponse.json(
          { success: false, error: `${field} majburiy` },
          { status: 400 },
        );
      }
    }

    // 1. Telefonni topish va stock tekshirish
    const phone = await Phone.findOne({ model: body.phoneModel });

    if (!phone) {
      return NextResponse.json(
        { success: false, error: `Model "${body.phoneModel}" topilmadi` },
        { status: 404 },
      );
    }

    if (phone.stock < 1) {
      return NextResponse.json(
        {
          success: false,
          error: `Model "${body.phoneModel}" omborda mavjud emas (qoldiq: ${phone.stock})`,
        },
        { status: 400 },
      );
    }

    // Stockni kamaytirish
    phone.stock -= 1;
    await phone.save();

    // rollback uchun saqlab qo'yamiz
    phoneToRevert = phone;

    // 2. Mijozni topish
    const customer = await Customer.findById(id);
    if (!customer) {
      // rollback
      phone.stock += 1;
      await phone.save();
      return NextResponse.json(
        { success: false, error: "Mijoz topilmadi" },
        { status: 404 },
      );
    }

    // 3. nextPaymentDate ni to'g'ri hisoblash
    const startDate = new Date(body.startDate);
    startDate.setHours(0, 0, 0, 0); // soatni tozalash

    const nextPaymentDate = new Date(startDate);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1); // +1 oy
    nextPaymentDate.setDate(body.paymentDay); // paymentDay kuniga o'rnatish
    nextPaymentDate.setHours(0, 0, 0, 0);

    // Agar paymentDay startDate dan oldin bo'lsa (masalan start 20-yanvar, payment 5-fevral)
    if (nextPaymentDate <= startDate) {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }

    // 4. Yangi shartnoma obyekti
    const newContract = {
      ...body,
      startDate: startDate,
      nextPaymentDate: nextPaymentDate,
      paidMonths: 0,
      status: body.status ?? "active",
    };

    // 5. Shartnomani qo'shish va saqlash
    customer.contracts.push(newContract);
    await customer.save();

    // Muvaffaqiyatli javob
    return NextResponse.json(
      {
        success: true,
        message: "Shartnoma qo'shildi, telefon omboridan 1 ta kamaydi",
        data: {
          customerId: customer._id,
          newContract: customer.contracts[customer.contracts.length - 1],
          phoneStockAfter: phone.stock,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    // Rollback: agar telefon stocki kamaygan bo'lsa qaytarib qo'yamiz
    if (phoneToRevert) {
      try {
        phoneToRevert.stock += 1;
        await phoneToRevert.save();
        console.log("[ROLLBACK] Telefon stocki qaytarildi");
      } catch (rollbackErr) {
        console.error("[ROLLBACK XATOSI]:", rollbackErr);
      }
    }

    console.error("Contract POST xatosi:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server xatosi" },
      { status: 500 },
    );
  }
}
