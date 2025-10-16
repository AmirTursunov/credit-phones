// ============================================================================
// TUZATILGAN ContractModal - app/components/modals/ContractModal.tsx
// ============================================================================

import React from "react";
import { X } from "lucide-react";
import { IPhone, ICustomer, IContract } from "../../types";

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  customer: ICustomer | null;
  phones: IPhone[];
  contract?: IContract | null;
  mode: "add" | "edit";
}

export default function ContractModal({
  show,
  onClose,
  onSubmit,
  customer,
  phones,
  contract,
  mode,
}: Props) {
  if (!show || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {mode === "add" ? "Yangi Shartnoma" : "Shartnomani Tahrirlash"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mijoz</label>
            <input
              value={customer.name}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Telefon Modeli *
            </label>
            <select
              name="phoneModel"
              defaultValue={contract?.phoneModel || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
            >
              <option value="">Tanlang</option>
              {phones.map((phone) => (
                <option key={phone._id} value={phone.model}>
                  {phone.model} ({phone.brand})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Umumiy Narx (so'm) *
            </label>
            <input
              name="price"
              type="number"
              defaultValue={contract?.price || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="15000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Boshlang'ich To'lov (so'm) *
            </label>
            <input
              name="downPayment"
              type="number"
              defaultValue={contract?.downPayment || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="3000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Oylik To'lov (so'm) *
            </label>
            <input
              name="monthlyPayment"
              type="number"
              defaultValue={contract?.monthlyPayment || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="1000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Muddati (oy) *
            </label>
            <input
              name="months"
              type="number"
              min="1"
              max="60"
              defaultValue={contract?.months || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="12"
            />
          </div>

          {mode === "edit" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                To'langan Oylar (0-{contract?.months || 0})
              </label>
              <input
                name="paidMonths"
                type="number"
                min="0"
                max={contract?.months || 0}
                defaultValue={contract?.paidMonths || 0}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              To'lov Kuni (1-28) *
            </label>
            <input
              name="paymentDay"
              type="number"
              min="1"
              max="28"
              defaultValue={contract?.paymentDay || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Boshlash Sanasi *
            </label>
            <input
              name="startDate"
              type="date"
              defaultValue={
                contract?.startDate
                  ? new Date(contract.startDate).toISOString().split("T")[0]
                  : ""
              }
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
            />
          </div>

          {mode === "edit" && (
            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                name="status"
                defaultValue={contract?.status || "active"}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              >
                <option value="active">Aktiv</option>
                <option value="completed">Tugallangan</option>
                <option value="cancelled">Bekor qilingan</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-medium"
          >
            {mode === "add" ? "Shartnoma Yaratish" : "Yangilash"}
          </button>
        </form>
      </div>
    </div>
  );
}
