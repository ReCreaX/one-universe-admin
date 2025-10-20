"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock3, Download, X } from "lucide-react";
import { disputeModalStore } from "@/store/disputeManagementStore";
import { Separator } from "@/components/ui/separator";
import { DisputeStatus } from "./DisputeStatus";
import Image from "next/image";
import Dropdown from "@/shared/Dropdown/Dropdown";
import { Textarea } from "@/components/ui/textarea";

const DisputeDetailsModal = () => {
  const { modalType, selectedDispute, closeModal } = disputeModalStore();
  const handleSelect = (value: string) => {
    console.log("Selected:", value);
  };

  return (
    <AnimatePresence>
      {modalType === "openDispute" && selectedDispute && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className=" shadow-lg w-[65%]  relative"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
          >
            <div className="flex items-center justify-between bg-[#E8FBF7]  px-8 py-4">
              <h2 className="text-xl font-semibold  text-[#171417]">
                Dispute Details
              </h2>

              <button
                onClick={closeModal}
                className=" text-gray-500 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>
            <div className="bg-white max-h-[80vh] overflow-y-auto scrollbar-hide">
              <section className="flex px-8">
                <aside className="flex-1 flex flex-col gap-[16px]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#171417] text-[1rem] font-medium">
                      Raised By
                    </h3>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[#454345] font-medium">
                        Jane Adebayo
                      </h3>
                      <p className="bg-[#E6E8E9] px-2 py-0.5  rounded-[8px] text-[.875rem] font-normal">
                        Buyer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#171417] text-[1rem] font-medium">
                      Service Provider
                    </h3>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[#454345] font-medium">Ayo Tech</h3>
                      <p className="bg-[#97EADA] px-2 py-0.5  rounded-[8px] text-[.875rem] font-normal">
                        Seller
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#171417] text-[1rem] font-medium">
                      Booking ID
                    </h3>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[#454345] text-[1rem]  font-normal">
                        #BK-2039
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#171417] text-[1rem] font-medium">
                      Amount
                    </h3>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[#454345] text-[1rem]  font-normal">
                        ₦50,000
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#171417] text-[1rem] font-medium">
                      Date & Time
                    </h3>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[#454345] text-[1rem]  font-normal">
                        May 11, 2025 – 11:00 AM
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#171417] text-[1rem] font-medium">
                      Services
                    </h3>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[#454345] text-[1rem]  font-normal">
                        Website Development
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#171417] text-[1rem] font-medium">
                      Job Status
                    </h3>
                    <div className="flex items-center gap-2">
                      <DisputeStatus status="Under review" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#171417] text-[1rem] font-medium">
                      Dispute Type
                    </h3>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[#454345] text-[1rem]  font-normal">
                        Quality Issues
                      </h3>
                    </div>
                  </div>
                  <div className=" flex flex-col gap-2">
                    <h3 className="font-bold text-[1rem] text-[#646264]">
                      Dispute Reason
                    </h3>
                    <div className="bg-[#FFFAFA] p-2 rounded-[8px]">
                      <p className=" text-[#171417] ">
                        Service was not completed and provider became
                        unreachable.
                      </p>
                    </div>
                  </div>
                </aside>

                <div className="border-[.5px] border-[#B7B6B7] mx-2"></div>
                <aside className="flex-1 flex flex-col gap-[24px]">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#171417] font-bold text-[1rem]">
                      Activity Feed
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[#171417] font-normal text-[1rem]">
                          Dispute Raised by Buyer
                        </p>
                        <div className="flex items-center gap-[4px] text-[#646264] font-normal text-[.875rem]">
                          <Clock3 size={16} />
                          <p className="">1/15/2024, 11:30:00 AM</p>
                        </div>
                      </div>
                      <p className="text-[#454345] text-[1rem] font-normal ">
                        Requesting rework for website functionality issues
                      </p>
                      <div className="flex items-center justify-between">
                        <h3 className="text-[#171417] font-medium">
                          Dispute Status
                        </h3>
                        <DisputeStatus status="New" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#171417] font-medium text-[1rem]">
                      Uploaded Evidence
                    </h3>
                    <div className="flex flex-col gap-[12px]">
                      <div className="flex items-center gap-4 ">
                        <Image
                          src="/icons/dispute-evidence.svg"
                          alt="Dispute Evidence Icon"
                          width={32}
                          height={32}
                        />
                        <div className="flex flex-1 justify-between items-center">
                          <div className="flex flex-col gap-1">
                            <h4 className="text-[#154751] font-medium text-[.875rem]">
                              Screenshot.png
                            </h4>
                            <p className="text-[#8C8989] font-normal text-[.875rem]">
                              200 KB
                            </p>
                          </div>
                          <Download
                            size={19}
                            className="text-[#373737] cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ">
                        <Image
                          src="/icons/dispute-evidence.svg"
                          alt="Dispute Evidence Icon"
                          width={32}
                          height={32}
                        />
                        <div className="flex flex-1 justify-between items-center">
                          <div className="flex flex-col gap-1">
                            <h4 className="text-[#154751] font-medium text-[.875rem]">
                              Invoice.pdf
                            </h4>
                            <p className="text-[#8C8989] font-normal text-[.875rem]">
                              200 KB
                            </p>
                          </div>
                          <Download
                            size={19}
                            className="text-[#373737] cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>
              </section>
              <section className="mt-[30px] px-5 flex flex-col gap-[16px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-[#171417] font-bold text-[1.25rem]">
                    Resolution Actions
                  </h3>
                  <button
                    className="text-[#020D27] border-[#04171F] rounded-[36px] border font-medium py-[12px] px-[24px]"
                    type="button"
                  >
                    Send Message
                  </button>
                </div>
                <div className="bg-[#EAF1FF] rounded-[8px] border-[.5px] border-[#006ADB]">
                  <p className="px-4 py-3 text-[#006ADB]">
                    Job In-Progress Dispute: 30% payment to seller is
                    non-refundable. 70% can be refunded or held based on
                    resolution.
                  </p>
                </div>
                <form className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#05060D] font-medium text-[1rem]">
                      Select Resolution
                    </label>
                    <Dropdown
                      placeholder="Select resolution action"
                      options={[
                        "Refund Buyer (70% only)",
                        "Pay Seller (Release 70%)",
                        "Split Payment Between Buyer & Seller",
                        "Seller Rework",
                      ]}
                      onSelect={handleSelect}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#05060D] font-medium text-[1rem]">
                      Resolution Comment
                    </label>
                    <textarea
                      placeholder="Add detailed explanation for your resolution decision"
                      className="
outline-none 
    border outline border-[#B2B2B4] 
    py-[11px] px-[16px] 
    rounded-[12px] 
    h-[123px] 
    resize-none 
    placeholder-[#B2B2B4] 
    text-[14px] 
    placeholder:font-normal
  "
                      name="decision"
                      id="decision"
                    />
                  </div>
                  <button
                    className="py-3 [background:var(--primary-radial)] mb-5 text-[#FFFFFF] rounded-[36px] font-medium cursor-pointer"
                    type="button"
                  >
                    Resolve Dispute
                  </button>
                </form>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DisputeDetailsModal;
