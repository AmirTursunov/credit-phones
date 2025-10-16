import React from "react";
import {
  Calendar,
  Phone,
  Users,
  DollarSign,
  AlertCircle,
  Mail,
} from "lucide-react";
import { ITodayPayment } from "../types";

interface DashboardProps {
  stats: {
    totalCustomers: number;
    activeContracts: number;
    totalRevenue: number;
    pendingPayments: number;
    totalPhones: number;
  };
  todayPayments: ITodayPayment[];
  handleSendEmail: (payment: ITodayPayment) => void;
}

export default function Dashboard({
  stats,
  todayPayments,
  handleSendEmail,
}: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Jami Mijozlar</p>
              <p className="text-3xl font-bold mt-2">{stats.totalCustomers}</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Aktiv Shartnomalar</p>
              <p className="text-3xl font-bold mt-2">{stats.activeContracts}</p>
            </div>
            <Calendar className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Jami Daromad</p>
              <p className="text-2xl font-bold mt-2">
                {(stats.totalRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Telefonlar Soni</p>
              <p className="text-3xl font-bold mt-2">{stats.totalPhones}</p>
            </div>
            <Phone className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Today's Payments */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-bold text-black">
            Bugungi To'lovlar ({todayPayments.length})
          </h3>
        </div>
        {todayPayments.length > 0 ? (
          <div className="space-y-3">
            {todayPayments.map((payment, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-red-50 border-l-4 border-red-500 rounded"
              >
                <div>
                  <p className="font-semibold">{payment.customer}</p>
                  <p className="text-sm text-gray-600">{payment.phoneModel}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {payment.phone}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">
                    {(payment.amount / 1000000).toFixed(1)}M so'm
                  </p>
                  <button
                    onClick={() => handleSendEmail(payment)}
                    className="mt-2 flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Email yuborish
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Bugun to'lov yo'q</p>
        )}
      </div>
    </div>
  );
}
