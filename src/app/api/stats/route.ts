import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import Customer from "../../models/Customer";
import Phone from "../../models/Phone";

export async function GET() {
  try {
    await connectDB();

    const totalCustomers = await Customer.countDocuments();

    const contractStats = await Customer.aggregate([
      { $unwind: "$contracts" },
      {
        $group: {
          _id: null,
          activeContracts: {
            $sum: {
              $cond: [{ $eq: ["$contracts.status", "active"] }, 1, 0],
            },
          },
          totalRevenue: {
            $sum: {
              $add: [
                // to‘langan oylik to‘lovlar
                {
                  $multiply: [
                    "$contracts.paidMonths",
                    "$contracts.monthlyPayment",
                  ],
                },
                // + boshlang‘ich to‘lov (har shartnomada faqat 1 marta)
                "$contracts.downPayment",
              ],
            },
          },
          pendingPayments: {
            $sum: {
              $cond: [
                { $eq: ["$contracts.status", "active"] },
                {
                  $multiply: [
                    {
                      $subtract: ["$contracts.months", "$contracts.paidMonths"],
                    },
                    "$contracts.monthlyPayment",
                  ],
                },
                0,
              ],
            },
          },
        },
      },
    ]);

    const statsData = contractStats[0] || {
      activeContracts: 0,
      totalRevenue: 0,
      pendingPayments: 0,
    };

    const totalPhonesResult = await Phone.aggregate([
      { $group: { _id: null, total: { $sum: "$stock" } } },
    ]);
    const totalPhones = totalPhonesResult[0]?.total || 0;

    const stats = {
      totalCustomers,
      activeContracts: statsData.activeContracts,
      totalRevenue: statsData.totalRevenue,
      pendingPayments: statsData.pendingPayments,
      totalPhones,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Stats xatosi:", error);
    return NextResponse.json(
      { success: false, error: "Server xatosi" },
      { status: 500 },
    );
  }
}
