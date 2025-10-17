import React from "react";
import { Search, Plus, Edit2, Trash2, Eye } from "lucide-react";
import { ICustomer } from "../types";

interface CustomersTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredCustomers: ICustomer[];
  setShowAddCustomer: (show: boolean) => void;
  setSelectedCustomer: (customer: ICustomer) => void;
  setShowViewContracts: (show: boolean) => void;
  setShowAddContract: (show: boolean) => void;
  setShowEditCustomer: (show: boolean) => void;
  handleDeleteCustomer: (id: string) => void;
}

export default function CustomersTab({
  searchTerm,
  setSearchTerm,
  filteredCustomers,
  setShowAddCustomer,
  setSelectedCustomer,
  setShowViewContracts,
  setShowAddContract,
  setShowEditCustomer,
  handleDeleteCustomer,
}: CustomersTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Mijoz qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-black text-black"
          />
        </div>
        <button
          onClick={() => setShowAddCustomer(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
          Yangi Mijoz
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            {/* min-width qo‘shish scroll uchun */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mijoz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Telefon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Shartnomalar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-black">
                        {customer.name}
                      </p>
                      <p className="text-sm text-yellow-500">
                        {customer.passport}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowViewContracts(true);
                      }}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      {customer.contracts.length} ta
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowAddContract(true);
                        }}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                        title="Shartnoma qo'shish"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowEditCustomer(true);
                        }}
                        className="text-green-500 hover:text-green-700"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer._id!)}
                        className="text-red-500 hover:text-red-700"
                        title="O'chirish"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
