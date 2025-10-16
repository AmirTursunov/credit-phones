// ============================================================================
// TUZATILGAN ViewContractsModal - app/components/modals/ViewContractsModal.tsx
// ============================================================================

import React, { useEffect } from "react";
import { X, Edit2, Trash2 } from "lucide-react";
import { ICustomer, IContract } from "../../types";

interface Props {
  show: boolean;
  onClose: () => void;
  customer: ICustomer | null;
  onEditContract: (contract: IContract) => void;
  onDeleteContract: (customerId: string, contractId: string) => void;
  fetchData: () => Promise<void>; // Yangi prop
  setSelectedCustomer: (customer: ICustomer) => void; // Yangi prop
}

export default function ViewContractsModal({
  show,
  onClose,
  customer,
  onEditContract,
  onDeleteContract,
  fetchData,
  setSelectedCustomer,
}: Props) {
  // Customer ma'lumotlarini yangilash
  useEffect(() => {
    if (show && customer?._id) {
      const refreshCustomer = async () => {
        try {
          const res = await fetch("/api/customers");
          const data = await res.json();
          if (data.success) {
            const updatedCustomer = data.data.find(
              (c: ICustomer) => c._id === customer._id
            );
            if (updatedCustomer) {
              setSelectedCustomer(updatedCustomer);
            }
          }
        } catch (error) {
          console.error("Error refreshing customer:", error);
        }
      };
      refreshCustomer();
    }
  }, [show]); // show o'zgarganda yangilaydi

  if (!show || !customer) return null;

  // To'lov sanasini hisoblash
  const getPaymentDate = (contract: IContract, monthIndex: number) => {
    const startDate = new Date(contract.startDate);
    if (isNaN(startDate.getTime())) {
      return new Date();
    }
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + monthIndex + 1);
    paymentDate.setDate(contract.paymentDay);
    return paymentDate;
  };

  // Status rangini aniqlash
  const getStatusColor = (contract: IContract) => {
    const today = new Date();
    const nextPayment = new Date(contract.nextPaymentDate);

    if (contract.status === "completed") {
      return "border-blue-500 bg-blue-50";
    } else if (contract.status === "cancelled") {
      return "border-red-500 bg-red-50";
    } else if (contract.paidMonths >= contract.months) {
      return "border-blue-500 bg-blue-50";
    } else {
      return "border-green-500 bg-green-50";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-black">
              {customer.name} - Shartnomalar
            </h2>
            <p className="text-sm text-gray-600">{customer.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {customer.contracts && customer.contracts.length > 0 ? (
          <div className="space-y-6">
            {customer.contracts.map((contract, idx) => (
              <div
                key={contract._id || idx}
                className={`border-2 rounded-lg p-5 hover:shadow-lg transition-shadow ${getStatusColor(
                  contract
                )}`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-black">
                      {contract.phoneModel}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                        contract.status === "active"
                          ? "bg-green-200 text-green-800"
                          : contract.status === "completed"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {contract.status === "active"
                        ? "Aktiv"
                        : contract.status === "completed"
                        ? "Tugallangan"
                        : "Bekor qilingan"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditContract(contract)}
                      className="p-2 text-blue-500 hover:bg-blue-100 rounded"
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        onDeleteContract(customer._id!, contract._id!)
                      }
                      className="p-2 text-red-500 hover:bg-red-100 rounded"
                      title="O'chirish"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="text-right ml-2">
                      <p className="text-2xl font-bold text-blue-600">
                        {(contract.price / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-sm text-gray-600">Umumiy narx</p>
                    </div>
                  </div>
                </div>

                {/* Ma'lumotlar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600">Boshlang'ich to'lov:</p>
                    <p className="font-semibold text-black">
                      {(contract.downPayment / 1000000).toFixed(1)}M so'm
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Oylik to'lov:</p>
                    <p className="font-semibold text-black">
                      {(contract.monthlyPayment / 1000000).toFixed(1)}M so'm
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Muddati:</p>
                    <p className="font-semibold text-black">
                      {contract.months} oy
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">To'langan:</p>
                    <p className="font-semibold text-lg text-green-600">
                      {contract.paidMonths} / {contract.months} oy
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Boshlash sanasi:</p>
                    <p className="font-semibold text-black">
                      {new Date(contract.startDate).toLocaleDateString("uz-UZ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Keyingi to'lov:</p>
                    <p className="font-semibold text-black">
                      {contract.paidMonths < contract.months
                        ? new Date(contract.nextPaymentDate).toLocaleDateString(
                            "uz-UZ"
                          )
                        : "To'landi"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">To'lov kuni:</p>
                    <p className="font-semibold text-black">
                      Har oyning {contract.paymentDay}-sanasi
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Qolgan:</p>
                    <p className="font-semibold text-orange-600">
                      {contract.months - contract.paidMonths} oy
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4 pb-4 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">To'lov jarayoni</p>
                    <p className="text-sm font-medium text-black">
                      {Math.round(
                        (contract.paidMonths / contract.months) * 100
                      )}
                      %
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (contract.paidMonths / contract.months) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Qolgan to'lov summasi */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Qolgan to'lov:</p>
                      <p className="text-xl font-bold text-blue-600">
                        {(
                          ((contract.months - contract.paidMonths) *
                            contract.monthlyPayment) /
                          1000000
                        ).toFixed(1)}
                        M so'm
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">To'langan:</p>
                      <p className="text-xl font-bold text-green-600">
                        {(
                          (contract.downPayment +
                            contract.paidMonths * contract.monthlyPayment) /
                          1000000
                        ).toFixed(1)}
                        M so'm
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">Shartnomalar yo'q</p>
        )}
      </div>
    </div>
  );
}
