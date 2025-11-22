"use client";

import React from "react";
import { PaymentStatus } from "./PaymentStatus";

type Payment = {
  id: string;
  serviceTitle: string;
  buyer: string;
  seller: string;
  totalAmount: string;
  status: "PAID" | "PENDING" | "DISPUTED" | "PENDING REFUND" | "REFUNDED";
  date: string;
};

interface PaymentTableProps {
  data: Payment[];
}

const PaymentTable = ({ data }: PaymentTableProps) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F7F7F7] text-left text-[.875rem] font-medium text-[#454345]">
            <th className="py-3 px-4 border-b">Payment ID</th>
            <th className="py-3 px-4 border-b">Service Title</th>
            <th className="py-3 px-4 border-b">Buyer Name</th>
            <th className="py-3 px-4 border-b">Seller Name</th>
            <th className="py-3 px-4 border-b">Total Amount</th>
            <th className="py-3 px-4 border-b">Payment Status</th>
            <th className="py-3 px-4 border-b">Date Created</th>
          </tr>
        </thead>
        <tbody>
          {data.map((payment) => (
            <tr
              key={payment.id}
              className="hover:bg-[#F2F2F2] transition-colors text-[.875rem] text-[#171417]"
            >
              <td className="py-3 px-4 border-b">{payment.id}</td>
              <td className="py-3 px-4 border-b">{payment.serviceTitle}</td>
              <td className="py-3 px-4 border-b">{payment.buyer}</td>
              <td className="py-3 px-4 border-b">{payment.seller}</td>
              <td className="py-3 px-4 border-b">{payment.totalAmount}</td>
              <td className="py-3 px-4 border-b">
                <PaymentStatus status={payment.status} />
              </td>
              <td className="py-3 px-4 border-b">{payment.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
