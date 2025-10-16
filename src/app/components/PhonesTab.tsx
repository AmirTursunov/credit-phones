import React from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { IPhone } from "../types";

interface PhonesTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredPhones: IPhone[];
  setShowAddPhone: (show: boolean) => void;
  setSelectedPhone: (phone: IPhone) => void;
  setShowEditPhone: (show: boolean) => void;
  handleDeletePhone: (id: string) => void;
}

export default function PhonesTab({
  searchTerm,
  setSearchTerm,
  filteredPhones,
  setShowAddPhone,
  setSelectedPhone,
  setShowEditPhone,
  handleDeletePhone,
}: PhonesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Telefon qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-black text-black"
          />
        </div>
        <button
          onClick={() => setShowAddPhone(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
          Yangi Telefon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPhones.map((phone) => (
          <div
            key={phone._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-black text-lg">
                  {phone.model}
                  {phone.memory && (
                    <span className="text-gray-500 text-sm ml-1">
                      ({phone.memory} GB)
                    </span>
                  )}
                </h3>
                <p className="text-black text-sm">{phone.brand}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedPhone(phone);
                    setShowEditPhone(true);
                  }}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                  title="Tahrirlash"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePhone(phone._id!)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                  title="O'chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-black">Narxi:</span>
                <span className="font-semibold text-black">
                  {(phone.price / 1000000).toLocaleString("uz-UZ", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}{" "}
                  mln so&apos;m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Omborda:</span>
                <span
                  className={`font-semibold ${
                    phone.stock < 5 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {phone.stock} ta
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
