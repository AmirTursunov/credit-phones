// ============================================================================
// FAYL 11: app/page.tsx - ASOSIY FAYL
// ============================================================================
"use client";

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import PhonesTab from "./components/PhonesTab";
import CustomersTab from "./components/CustomersTab";
import PhoneModal from "./components/modals/PhoneModal";
import CustomerModal from "./components/modals/CustomerModal";
import ContractModal from "./components/modals/ContractModal";
import ViewContractsModal from "./components/modals/ViewContractsModal";
import { IPhone, ICustomer, IContract, ITodayPayment } from "./types";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [phones, setPhones] = useState<IPhone[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [todayPayments, setTodayPayments] = useState<ITodayPayment[]>([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeContracts: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    totalPhones: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [showAddPhone, setShowAddPhone] = useState(false);
  const [showEditPhone, setShowEditPhone] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [showAddContract, setShowAddContract] = useState(false);
  const [showEditContract, setShowEditContract] = useState(false);
  const [showViewContracts, setShowViewContracts] = useState(false);

  // Selected items
  const [selectedPhone, setSelectedPhone] = useState<IPhone | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(
    null
  );
  const [selectedContract, setSelectedContract] = useState<IContract | null>(
    null
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [phonesRes, customersRes, paymentsRes, statsRes] =
        await Promise.all([
          fetch("/api/telefon"),
          fetch("/api/customers"),
          fetch("/api/payments/today"),
          fetch("/api/stats"),
        ]);

      const phonesData = await phonesRes.json();
      const customersData = await customersRes.json();
      const paymentsData = await paymentsRes.json();
      const statsData = await statsRes.json();

      if (phonesData.success) setPhones(phonesData.data);
      if (customersData.success) setCustomers(customersData.data);
      if (paymentsData.success) setTodayPayments(paymentsData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error("Ma'lumot yuklashda xatolik:", error);
    }
    setLoading(false);
  };

  // ========== TELEFON CRUD ==========
  const handleAddPhone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const phone = {
      model: formData.get("model") as string,
      brand: formData.get("brand") as string,
      memory: formData.get("memory") as string,
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
    };
    console.log(phone.memory);
    console.log(phone.brand);
    try {
      const res = await fetch("/api/telefon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(phone),
      });
      if (res.ok) {
        setShowAddPhone(false);
        fetchData();
        alert("Telefon qo'shildi!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi!");
    }
  };

  const handleEditPhone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPhone?._id) return;

    const formData = new FormData(e.currentTarget);

    const phone = {
      model: formData.get("model") as string,
      brand: formData.get("brand") as string,
      memory: formData.get("memory") as string,
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
    };

    try {
      const res = await fetch(`/api/telefon/${selectedPhone._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(phone),
      });
      if (res.ok) {
        setShowEditPhone(false);
        setSelectedPhone(null);
        fetchData();
        alert("Telefon yangilandi!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi!");
    }
  };

  const handleDeletePhone = async (id: string) => {
    if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/telefon/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        alert("Telefon o'chirildi!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi!");
    }
  };

  // ========== MIJOZ CRUD ==========
  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const customer = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      passport: formData.get("passport") as string,
      address: formData.get("address") as string,
      contracts: [],
    };

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });
      if (res.ok) {
        setShowAddCustomer(false);
        fetchData();
        alert("Mijoz qo'shildi!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi!");
    }
  };

  const handleEditCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCustomer?._id) return;

    const formData = new FormData(e.currentTarget);
    const customer = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      passport: formData.get("passport") as string,
      address: formData.get("address") as string,
    };

    try {
      const res = await fetch(`/api/customers/${selectedCustomer._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });
      if (res.ok) {
        setShowEditCustomer(false);
        setSelectedCustomer(null);
        fetchData();
        alert("Mijoz yangilandi!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi!");
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (
      !confirm(
        "Rostdan ham o'chirmoqchimisiz? Barcha shartnomalar ham o'chadi!"
      )
    )
      return;
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        alert("Mijoz o'chirildi!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi!");
    }
  };

  // ========== SHARTNOMA CRUD ==========
  const handleAddContract = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCustomer?._id) return;

    const formData = new FormData(e.currentTarget);
    const startDate = new Date(formData.get("startDate") as string);
    const months = Number(formData.get("months"));
    const paymentDay = startDate.getDate(); // Boshlanish kunini olish

    // nextPaymentDate = startDate + 1 oy, lekin kun bir xil
    const nextPaymentDate = new Date(startDate);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    const contract = {
      phoneModel: formData.get("phoneModel") as string,
      price: Number(formData.get("price")),
      downPayment: Number(formData.get("downPayment")),
      monthlyPayment: Number(formData.get("monthlyPayment")),
      months,
      paymentDay,
      startDate,
      nextPaymentDate,
      paidMonths: 0,
      status: "active" as const,
    };

    try {
      const res = await fetch(
        `/api/customers/${selectedCustomer._id}/contracts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contract),
        }
      );

      if (res.ok) {
        setShowAddContract(false);
        setSelectedCustomer(null);
        fetchData();
        alert("Shartnoma yaratildi!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi!");
    }
  };

  const handleEditContract = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCustomer?._id || !selectedContract?._id) return;

    const formData = new FormData(e.currentTarget);
    const startDate = new Date(formData.get("startDate") as string);
    const paidMonths = Number(formData.get("paidMonths"));
    const months = Number(formData.get("months"));
    const paymentDay = Number(formData.get("paymentDay"));

    // Keyingi to'lov sanasini hisoblash
    const nextPaymentDate = new Date(startDate);
    nextPaymentDate.setMonth(startDate.getMonth() + paidMonths + 1);
    nextPaymentDate.setDate(paymentDay);

    // Statusni aniqlash
    let status = formData.get("status") as "active" | "completed" | "cancelled";

    // Agar barcha oylar to'langan bo'lsa, avtomatik "completed"
    if (paidMonths >= months) {
      status = "completed";
    }

    const contract = {
      phoneModel: formData.get("phoneModel") as string,
      price: Number(formData.get("price")),
      downPayment: Number(formData.get("downPayment")),
      monthlyPayment: Number(formData.get("monthlyPayment")),
      months,
      paymentDay,
      startDate,
      nextPaymentDate,
      paidMonths,
      status,
    };

    try {
      const res = await fetch(
        `/api/customers/${selectedCustomer._id}/contracts/${selectedContract._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contract),
        }
      );

      if (res.ok) {
        // Edit modalni yopish
        setShowEditContract(false);
        setSelectedContract(null);

        // Ma'lumotlarni yangilash
        await fetchData();

        // selectedCustomer ni yangilash
        const updatedCustomersRes = await fetch("/api/customers");
        const updatedCustomersData = await updatedCustomersRes.json();

        if (updatedCustomersData.success) {
          const updatedCustomer = updatedCustomersData.data.find(
            (c: ICustomer) => c._id === selectedCustomer._id
          );
          if (updatedCustomer) {
            setSelectedCustomer(updatedCustomer);
          }
        }

        alert("Shartnoma yangilandi!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi!");
    }
  };

  const handleDeleteContract = async (
    customerId: string,
    contractId: string
  ) => {
    if (!confirm("Shartnomani o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(
        `/api/customers/${customerId}/contracts/${contractId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        fetchData();
        setShowViewContracts(false);
        alert("Shartnoma o'chirildi!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi!");
    }
  };

  // ========== EMAIL YUBORISH ==========
  const handleSendEmail = async (payment: ITodayPayment) => {
    try {
      const res = await fetch("/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: payment.email,
          customerName: payment.customer,
          phoneModel: payment.phoneModel,
          amount: payment.amount,
          paymentDate: new Date().toLocaleDateString("uz-UZ"),
          customerId: payment.customerId,
          contractId: payment.contractId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Email muvaffaqiyatli yuborildi!");
      } else {
        alert("Email yuborishda xatolik!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Email yuborishda xatolik!");
    }
  };

  // ========== FILTER ==========
  const filteredPhones = phones.filter(
    (p) =>
      p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSearchTerm={setSearchTerm}
      />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "dashboard" && (
          <Dashboard
            stats={stats}
            todayPayments={todayPayments}
            handleSendEmail={handleSendEmail}
          />
        )}

        {activeTab === "phones" && (
          <PhonesTab
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredPhones={filteredPhones}
            setShowAddPhone={setShowAddPhone}
            setSelectedPhone={setSelectedPhone}
            setShowEditPhone={setShowEditPhone}
            handleDeletePhone={handleDeletePhone}
          />
        )}

        {activeTab === "customers" && (
          <CustomersTab
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredCustomers={filteredCustomers}
            setShowAddCustomer={setShowAddCustomer}
            setSelectedCustomer={setSelectedCustomer}
            setShowViewContracts={setShowViewContracts}
            setShowAddContract={setShowAddContract}
            setShowEditCustomer={setShowEditCustomer}
            handleDeleteCustomer={handleDeleteCustomer}
          />
        )}
      </main>
      {/* MODALS */}
      <PhoneModal
        show={showAddPhone}
        onClose={() => setShowAddPhone(false)}
        onSubmit={handleAddPhone}
        mode="add"
      />
      <PhoneModal
        show={showEditPhone}
        onClose={() => {
          setShowEditPhone(false);
          setSelectedPhone(null);
        }}
        onSubmit={handleEditPhone}
        phone={selectedPhone}
        mode="edit"
      />
      <CustomerModal
        show={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        onSubmit={handleAddCustomer}
        mode="add"
      />
      <CustomerModal
        show={showEditCustomer}
        onClose={() => {
          setShowEditCustomer(false);
          setSelectedCustomer(null);
        }}
        onSubmit={handleEditCustomer}
        customer={selectedCustomer}
        mode="edit"
      />
      <ContractModal
        show={showAddContract}
        onClose={() => {
          setShowAddContract(false);
          setSelectedCustomer(null);
        }}
        onSubmit={handleAddContract}
        customer={selectedCustomer}
        phones={phones}
        mode="add"
      />
      <ContractModal
        show={showEditContract}
        onClose={() => {
          setShowEditContract(false);
          setSelectedContract(null);
        }}
        onSubmit={handleEditContract}
        customer={selectedCustomer}
        phones={phones}
        contract={selectedContract}
        mode="edit"
      />
      <ViewContractsModal
        show={showViewContracts}
        onClose={() => {
          setShowViewContracts(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onEditContract={(contract) => {
          setSelectedContract(contract);
          setShowEditContract(true);
          // ViewContractsModal ochiq qoladi
        }}
        onDeleteContract={handleDeleteContract}
        fetchData={fetchData} // fetchData ni props qilib berish
        setSelectedCustomer={setSelectedCustomer} // setSelectedCustomer ni props qilib berish
      />

      <ContractModal
        show={showEditContract}
        onClose={() => {
          setShowEditContract(false);
          setSelectedContract(null);
        }}
        onSubmit={handleEditContract}
        customer={selectedCustomer}
        phones={phones}
        contract={selectedContract}
        mode="edit"
      />
    </div>
  );
}
