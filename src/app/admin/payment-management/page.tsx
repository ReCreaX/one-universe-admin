"use client";

import { useEffect, useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import PaymentTable from "./PaymentTable";
import EmptyPaymentManagement from "./EmptyPaymentManagement";
import NoPaymentManagement from "./NoPaymentManagement";

type Payment = {
  id: string;
  serviceTitle: string;
  buyer: string;
  seller: string;
  totalAmount: string;
  status: "PAID" | "PENDING" | "DISPUTED" | "PENDING REFUND" | "REFUNDED";
  date: string;
};

const PaymentManagementPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Sample payment data
    setPayments([
      {
        id: "PAY-001",
        serviceTitle: "Website Development",
        buyer: "Jane Adebayo",
        seller: "Ayo Tech",
        totalAmount: "₦50,000",
        status: "PAID",
        date: "Nov 22, 2025",
      },
      {
        id: "PAY-002",
        serviceTitle: "Mobile App Design",
        buyer: "John Doe",
        seller: "Tech Labs",
        totalAmount: "₦75,000",
        status: "PENDING",
        date: "Nov 20, 2025",
      },
      {
        id: "PAY-003",
        serviceTitle: "Logo Design",
        buyer: "Alice Smith",
        seller: "Creative Studio",
        totalAmount: "₦20,000",
        status: "DISPUTED",
        date: "Nov 18, 2025",
      },
      {
        id: "PAY-004",
        serviceTitle: "SEO Optimization",
        buyer: "Bob Johnson",
        seller: "SEO Experts",
        totalAmount: "₦40,000",
        status: "PENDING REFUND",
        date: "Nov 15, 2025",
      },
      {
        id: "PAY-005",
        serviceTitle: "Content Writing",
        buyer: "Eva Green",
        seller: "Content Hub",
        totalAmount: "₦10,000",
        status: "REFUNDED",
        date: "Nov 10, 2025",
      },
    ]);
  }, []);

  // Filter payments based on search query
  const filteredPayments = payments.filter(
    (p) =>
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine what to render
  let content;
  if (payments.length === 0) content = <EmptyPaymentManagement />;
  else if (filteredPayments.length === 0) content = <NoPaymentManagement />;
  else content = <PaymentTable data={filteredPayments} />;

  return (
    <section className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#171417]">
            Payment Management
          </h1>
          <p className="text-[#6B6969]">
            Oversee all payouts and refunds to ensure sellers are paid
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-3 md:mt-0">
          <input
            type="text"
            placeholder="Search by Payment ID, Buyer/Seller Name, or Service Title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-[#B7B6B7] rounded-md px-4 py-2 w-full md:w-[400px] outline-none text-sm"
          />
          <button className="flex items-center gap-2 bg-[#007BFF] text-white px-4 py-2 rounded-md">
            Export <HiOutlineLogout size={16} />
          </button>
        </div>
      </div>

      {/* Table / Empty States */}
      <div>{content}</div>
    </section>
  );
};

export default PaymentManagementPage;
