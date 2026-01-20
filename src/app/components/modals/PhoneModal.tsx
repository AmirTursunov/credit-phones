import React from "react";
import { X } from "lucide-react";
import { IPhone } from "../../types";

interface PhoneModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  phone?: IPhone | null;
  mode: "add" | "edit";
}

export default function PhoneModal({
  show,
  onClose,
  onSubmit,
  phone,
  mode,
}: PhoneModalProps) {
  if (!show) return null;
  const BRANDS = [
    "Apple",
    "Samsung",
    "Xiaomi",
    "Huawei",
    "Oppo",
    "Vivo",
    "Realme",
  ];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {mode === "add" ? "Yangi Telefon Qo'shish" : "Telefonni Tahrirlash"}
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
            <label className="block text-sm font-medium mb-1">Model *</label>
            <input
              name="model"
              defaultValue={phone?.model || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="iPhone 14 Pro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Xotira *</label>
            <input
              name="memory"
              defaultValue={phone?.memory || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="128GB"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Brend *</label>
            <select
              name="brand"
              defaultValue={phone?.brand || ""}
              required
              className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" disabled>
                Brendni tanlang
              </option>

              {BRANDS.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Narxi (so&apos;m) *
            </label>
            <input
              name="price"
              type="number"
              defaultValue={phone?.price || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="15000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Omborda (dona) *
            </label>
            <input
              name="stock"
              type="number"
              defaultValue={phone?.stock || ""}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="10"
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
