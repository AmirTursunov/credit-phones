import React from "react";
import { Calendar, Phone, Users } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSearchTerm: (term: string) => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  setSearchTerm,
}: NavigationProps) {
  const tabs = [
    { id: "dashboard", label: "Bosh sahifa", icon: Calendar },
    { id: "phones", label: "Telefonlar", icon: Phone },
    { id: "customers", label: "Mijozlar", icon: Users },
  ];

  return (
    <nav className="bg-white shadow-sm mt-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm("");
                }}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
