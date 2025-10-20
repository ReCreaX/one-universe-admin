"use client";
import { Separator } from "@/components/ui/separator";

import { MoveUp, ChevronUp } from "lucide-react";
import Image from "next/image";
import { SetStateAction, useState } from "react";

const DashboardPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Monthly");

  const options = ["Daily", "Weekly", "Monthly"];

  const handleSelect = (option: SetStateAction<string>) => {
    setSelected(option);
    setIsOpen(false);
  };
  return (
    <main className="flex flex-col flex-1  gap-[8px] md:gap-[16px]">
      <section className="flex flex-col gap-2">
        <h3 className="text-[#171417] font-bold text-[1.5rem] leading-[120%]">
          Dashboard
        </h3>
        <p className="text-[#6B6969] hidden md:block text-[1rem] leading-[140%]">
          Overview of key metrics and activity
        </p>
      </section>
      {/* <section className="grid grid-cols-1  lg:max-[1200px]:grid-cols-2 lg:min-[1200px]:grid-cols-4 gap-[16px] my-[24px]"> */}
      <section className="grid grid-cols-1 min-[410px]:grid-cols-2 min-[1200px]:grid-cols-4 gap-[16px] my-[24px]">
        <aside className="h-[123px] border border-[#E8E3E3] rounded-[8px] py-[12px] px-[16px] flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex item-center gap-[8px]">
              <div className="bg-[#3621EE] size-[20px] p-1 rounded-[4px]">
                <Image
                  src="/logo/logo-vector.svg"
                  alt="Logo"
                  width={12}
                  height={11}
                />
              </div>
              <h3 className="text-[#171417] font-medium leading-[140%] text-[1rem]">
                Total App Users
              </h3>
            </div>
            <h3 className="font-bold text-[#171417] text-[1.25rem] leading-[140%]">
              0
            </h3>
          </div>
          <Separator />
          <div className="flex items-center gap-[8px]">
            <div className="bg-[#D7FFE9] p-0.5 rounded-[2px]">
              <MoveUp size={8} className="text-[#1FC16B]" />
            </div>
            <p className="text-[#171417] text-[.75rem] font-normal leading-[140%]">
              <span>+21%</span> from last month
            </p>
          </div>
        </aside>
        <aside className="h-[123px] border border-[#E8E3E3] rounded-[8px] py-[12px] px-[16px] flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex item-center gap-[8px]">
              <div className="[background:var(--primary-radial)]  size-[20px] p-1 rounded-[4px]">
                <Image
                  src="/logo/logo-vector.svg"
                  alt="Logo"
                  width={12}
                  height={11}
                />
              </div>
              <h3 className="text-[#171417] font-medium leading-[140%] text-[1rem]">
                Total Buyers
              </h3>
            </div>
            <h3 className="font-bold text-[#171417] text-[1.25rem] leading-[140%]">
              0
            </h3>
          </div>
          <Separator />
          <div className="flex items-center gap-[8px]">
            <div className="bg-[#E9BCB7] p-0.5 rounded-[2px]">
              <MoveUp size={8} className="text-[#D00416]" />
            </div>
            <p className="text-[#171417] text-[.75rem] font-normal leading-[140%]">
              <span>-21%</span> from last month
            </p>
          </div>
        </aside>
        <aside className="h-[123px] border border-[#E8E3E3] rounded-[8px] py-[12px] px-[16px] flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex item-center gap-[8px]">
              <div className="bg-[#67A344] size-[20px] p-1 rounded-[4px]">
                <Image
                  src="/logo/logo-vector.svg"
                  alt="Logo"
                  width={12}
                  height={11}
                />
              </div>
              <h3 className="text-[#171417] font-medium leading-[140%] text-[1rem]">
                Total Sellers
              </h3>
            </div>
            <h3 className="font-bold text-[#171417] text-[1.25rem] leading-[140%]">
              0
            </h3>
          </div>
          <Separator />
          <div className="flex items-center gap-[8px]">
            <div className="bg-[#D7FFE9] p-0.5 rounded-[2px]">
              <MoveUp size={8} className="text-[#1FC16B]" />
            </div>
            <p className="text-[#171417] text-[.75rem] font-normal leading-[140%]">
              <span>+21%</span> from last month
            </p>
          </div>
        </aside>
        <aside className="h-[123px] border border-[#E8E3E3] rounded-[8px] py-[12px] px-[16px] flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex item-center gap-[8px]">
              <div className="bg-[#CE1474] size-[20px] p-1 rounded-[4px]">
                <Image
                  src="/logo/logo-vector.svg"
                  alt="Logo"
                  width={12}
                  height={11}
                />
              </div>
              <h3 className="text-[#171417] font-medium leading-[140%] text-[1rem]">
                Total Bookings
              </h3>
            </div>
            <h3 className="font-bold text-[#171417] text-[1.25rem] leading-[140%]">
              0
            </h3>
          </div>
          <Separator />
          <div className="flex items-center gap-[8px]">
            <div className="bg-[#D7FFE9] p-0.5 rounded-[2px]">
              <MoveUp size={8} className="text-[#1FC16B]" />
            </div>
            <p className="text-[#171417] text-[.75rem] font-normal leading-[140%]">
              <span>+21%</span> from last month
            </p>
          </div>
        </aside>
      </section>

      <section className="border flex-1 border-[#E8E3E3] min-h-[475px] rounded-[16px] p-[12px] md:py-[24px] md:px-[25px] mb-[40px]">
        <section className="">
          <section className=" flex items-center justify-between">
            <h3 className="text-[#171417] font-medium leading-[140%] text-[1.25rem]">
              User Growth
            </h3>
            <div className="relative w-[160px]">
              {/* Dropdown Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2 bg-white border border-[#B5B1B1] rounded-[8px] flex items-center justify-between text-sm font-normal hover:border-gray-400 transition-colors"
              >
                <span>{selected}</span>
                <ChevronUp
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isOpen ? "" : "rotate-180"
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-lg z-10">
                  {options.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={`w-full px-2 h-[38px] flex items-center gap-2 text-left hover:bg-gray-50 transition-colors
            ${index !== options.length - 1 ? "border-b border-[#E5E5E5]" : ""}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          selected === option
                            ? "border-[#04171F] bg-white"
                            : "border-[#757575] bg-white"
                        }`}
                      >
                        {selected === option && (
                          <div className="w-2.5 h-2.5 rounded-full [background:var(--primary-radial)]" />
                        )}
                      </div>

                      <span className="text-[1rem] leading-[140%] font-normal text-[#3C3C3C]">
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="flex items-center justify-end gap-[16px] mt-[20px]">
            <aside className="flex px-6.5 items-center gap-[8px] mt-[16px]">
              <div className="bg-[#6F41A4] size-[12px] rounded-full"></div>
              <p className="text-[.875rem] leading-[140%] font-normal text-[#303237]">
                Buyers
              </p>
            </aside>
            <aside className="flex pl-4.5 items-center gap-[8px] mt-[16px]">
              <div className="[background:var(--primary-radial)]  size-[12px] rounded-full"></div>
              <p className="text-[.875rem] leading-[140%] font-normal text-[#303237]">
                Sellers
              </p>
            </aside>
          </section>
        </section>
      </section>
      {/* <section className="h-[300px]"></section> */}
    </main>
  );
};

export default DashboardPage;
