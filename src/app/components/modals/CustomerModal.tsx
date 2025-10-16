import React from "react";
import { X } from "lucide-react";
import { ICustomer } from "../../types";

interface CustomerModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  customer?: ICustomer | null;
  mode: "add" | "edit";
}

export default function CustomerModal({
  show,
  onClose,
  onSubmit,
  customer,
  mode,
}: CustomerModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {mode === "add" ? "Yangi Mijoz Qo'shish" : "Mijozni Tahrirlash"}
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
            <label className="block text-sm font-medium mb-1">
              Ism Familiya *
            </label>
            <input
              name="name"
              defaultValue={customer?.name || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ali Valiyev"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefon *</label>
            <input
              name="phone"
              defaultValue={customer?.phone || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="+998901234567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              name="email"
              type="email"
              defaultValue={customer?.email || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="ali@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pasport *</label>
            <input
              name="passport"
              defaultValue={customer?.passport || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="AA1234567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Manzil *</label>
            <input
              name="address"
              defaultValue={customer?.address || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Toshkent, Chilonzor"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-medium"
          >
            {mode === "add" ? "Qo'shish" : "Yangilash"}
          </button>
        </form>
      </div>
    </div>
  );
}
