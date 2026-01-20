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
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 text-black"
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
        {filteredPhones.map((phone) => {
          const isOutOfStock = phone.stock === 0;

          return (
            <div
              key={phone._id}
              className={`
                bg-white rounded-lg shadow-md p-6 transition-all duration-200 relative
                ${isOutOfStock ? "opacity-70 bg-gray-50" : "hover:shadow-lg hover:border-blue-200"}
              `}
            >
              {/* Badge faqat stock 0 bo'lsa chiqadi */}

              {/* Kontent */}
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

                {/* Edit va Delete tugmalari DOIM faol */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedPhone(phone);
                      setShowEditPhone(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Tahrirlash (stockni o'zgartirish mumkin)"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeletePhone(phone._id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Narxi:</span>
                  <span className="font-semibold text-gray-900">
                    {(phone.price / 1000000).toLocaleString("uz-UZ", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}{" "}
                    mln so'm
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Omborda:</span>
                  <span
                    className={`font-semibold text-base ${
                      isOutOfStock
                        ? "text-red-600"
                        : phone.stock <= 3
                          ? "text-orange-600"
                          : "text-green-600"
                    }`}
                  >
                    {phone.stock === 0 ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full border border-red-200">
                        Hozircha mavjud emas
                      </span>
                    ) : (
                      <span
                        className={`font-semibold text-base ${
                          phone.stock <= 3
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {phone.stock} ta
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
