import React from "react";
import { Check, Clock, AlertCircle, Phone, Search } from "lucide-react";

interface PaymentItem {
  customer: string;
  phone: string;
  email?: string;
  phoneModel: string;
  amount: number;
  dueDate: string; // masalan "2026-02-17"
  status: "paid" | "pending" | "overdue";
  contractId: string;
  customerId: string;
}

interface AllPaymentsTabProps {
  payments: PaymentItem[];
  loading: boolean;
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  filteredPayments?: PaymentItem[];
}

export default function AllPaymentsTab({
  payments,
  loading,
  setSearchTerm,
  searchTerm,
  filteredPayments,
}: AllPaymentsTabProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }
  const dataToRender = filteredPayments ?? payments;

  const sortedPayments = [...dataToRender].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Barcha to'lovlar</h2>
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Ismi, telefon raqam, model"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 text-black"
        />
      </div>
      {sortedPayments.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          Hozircha hech qanday to'lov yo'q
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedPayments.map((payment, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-xl border-l-4 shadow-sm ${
                payment.status === "paid"
                  ? "bg-green-50 border-green-500"
                  : payment.status === "overdue"
                    ? "bg-red-50 border-red-500"
                    : "bg-yellow-50 border-yellow-500"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{payment.customer}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {payment.phoneModel}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {payment.phone}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">
                    {(payment.amount / 1000000).toFixed(1)}M so'm
                  </p>

                  <div className="mt-2 flex items-center gap-2 justify-end">
                    {payment.status === "paid" ? (
                      <>
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-medium">
                          To'langan
                        </span>
                      </>
                    ) : payment.status === "overdue" ? (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="text-red-700 font-medium">
                          Kechikkan
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span className="text-yellow-700 font-medium">
                          Kutilmoqda
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    To'lov sanasi:{" "}
                    {new Date(payment.dueDate).toLocaleDateString("uz-UZ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
