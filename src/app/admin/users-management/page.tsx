// "use client";
// import { ListFilter, Plus, Search, TableCellsSplit } from "lucide-react";
// import UserTabSelector from "./UserTabSelector";
// import BuyersTable from "./Tabs/BuyerTabs/BuyersTable";
// import SellersTable from "./Tabs/SellersTabs/SellersTable";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { userManagementStore } from "@/store/userManagementStore";
// import BuyerDetails from "./Tabs/BuyerTabs/BuyerDetails";
// import SellerDetails from "./Tabs/SellersTabs/SellerDetails";
// import AdminTable from "./Tabs/AdminTabs/AdminTable";
// import { useState } from "react";
// import BuyerFilters from "./Filters/BuyerFilters";

// const UsersManagement = () => {
//   const { modalType } = userManagementStore();
//   const [showFilter, setShowFilter] = useState(false);
//   const handleApplyBuyerFilter = (filters: {
//     status?: "daily" | "weekly" | "monthly";
//     fromDate?: Date;
//     toDate?: Date;
//   }) => {
//     console.log("Applied Filters:", filters);

//     // Example: send filters to API
//     // api.get("/some-endpoint", { params: filters });
//   };

//   return (
//     <Tabs
//       defaultValue="Buyers"
//       className="flex flex-col gap-[8px] md:gap-[16px]"
//     >
//       <section className=" flex flex-col justify-between md:flex-row gap-[16px]">
//         <section className="flex flex-col  gap-2">
//           <h3 className="text-[#171417] font-bold text-[1.5rem] sm:text-[1.25rem] leading-[120%]">
//             User Management
//           </h3>
//           <p className="text-[#6B6969] text-[1rem] sm:text-[.875rem] leading-[140%]">
//             Monitor, filter, and manage platform users effectively.
//           </p>
//         </section>
//         <TabsContent
//           className="flex items-center justify-end"
//           value="Admin Users"
//         >
//           <button
//             className="[background:var(--primary-radial)] px-[24px]  w-full md:w-fit flex items-center justify-center gap-[16px] text-[#FDFDFD] h-[46px] rounded-[20px] cursor-pointer"
//             type="button"
//           >
//             <Plus size={16} />
//             <p className="">Invite Admin</p>
//           </button>
//         </TabsContent>
//       </section>
//       <div className="my-[30px] md:px-[15px] relative">
//         <section className="pb-3">
//           <h3 className="text-[#171417] font-medium text-[1.25rem] leading-[140%] mb-[20px] px-[25px]">
//             All Buyers
//           </h3>
//           <section className="flex items-center justify-between">
//             <UserTabSelector />
//             <aside className="flex items-center justify-between gap-[24px]">
//               <div className="border border-[#B7B6B7] relative w-[532px] rounded-[8px]">
//                 <input
//                   type="text"
//                   placeholder="Search by name, email, service, or phone..."
//                   className="w-full h-[46px] pl-[40px] pr-[16px] rounded-[8px] outline-none text-[#7B7B7B] placeholder:text-[#6B6969] placeholder:text-[.75rem] text-[.75rem] md:text-[1rem] leading-[140%] font-normal"
//                 />
//                 <Search
//                   size={16}
//                   className="text-[#6B6969] absolute left-4 top-4"
//                 />
//               </div>
//               <div className="">
//                 <button
//                   className="border border-[#B7B6B7] flex items-center h-[48px] md:h-[46px]  px-[8px] rounded-[8px] gap-2 cursor-pointer"
//                   type="button"
//                   onClick={() => setShowFilter(!showFilter)}
//                 >
//                   <ListFilter size={16} />
//                   <span className="md:block hidden text-[#171417] text-[1rem] leading-[140%]">
//                     Filter
//                   </span>
//                 </button>
//               </div>
//             </aside>
//           </section>
//         </section>
//         <BuyerFilters onApplyFilter={handleApplyBuyerFilter} />
//         <TabsContent value="Buyers">
//           <BuyersTable />
//         </TabsContent>
//         0050497738
//         <TabsContent value="Sellers">
//           <SellersTable />
//         </TabsContent>
//         <TabsContent value="Admin Users">
//           <AdminTable />
//         </TabsContent>
//         {modalType === "openBuyer" && <BuyerDetails />}
//         {modalType === "openSeller" && <SellerDetails />}

//         {/* <BuyersTable /> */}
//       </div>
//     </Tabs>
//   );
// };

// export default UsersManagement;

"use client";
import { ListFilter, Plus, Search } from "lucide-react";
import UserTabSelector from "./UserTabSelector";
import BuyersTable from "./Tabs/BuyerTabs/BuyersTable";
import SellersTable from "./Tabs/SellersTabs/SellersTable";
import AdminTable from "./Tabs/AdminTabs/AdminTable";
import BuyerDetails from "./Tabs/BuyerTabs/BuyerDetails";
import SellerDetails from "./Tabs/SellersTabs/SellerDetails";
import BuyerFilters from "./Filters/BuyerFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userManagementStore } from "@/store/userManagementStore";
import { useState, useRef, useEffect } from "react";
import SellerFilters from "./Filters/SellerFilters";

const UsersManagement = () => {
  const { modalType } = userManagementStore();
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "Buyers" | "Sellers" | "Admin Users"
  >("Buyers");

  const filterRef = useRef<HTMLDivElement>(null);

  const handleApplyBuyerFilter = (filters: {
    status?: "inactive" | "active" | "pending";
    fromDate?: Date;
    toDate?: Date;
  }) => {
    console.log("Applied Filters:", filters);
    // send filters to API
  };

  const handleApplySellerFilter = (filters: {
    status?: "active" | "inactive" | "pending";
    verification?: "verified" | "unverified";
    fromDate?: Date;
    toDate?: Date;
  }) => {
    console.log("Applied Filters:", filters);
    // send filters to API
  };

  // Detect click outside to close filter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => setActiveTab(val as typeof activeTab)}
      className="flex flex-col gap-[8px] md:gap-[16px]"
    >
      <section className="flex flex-col justify-between md:flex-row gap-[16px]">
        <section className="flex flex-col gap-2">
          <h3 className="text-[#171417] font-bold text-[1.5rem] sm:text-[1.25rem] leading-[120%]">
            User Management
          </h3>
          <p className="text-[#6B6969] text-[1rem] sm:text-[.875rem] leading-[140%]">
            Monitor, filter, and manage platform users effectively.
          </p>
        </section>

        <TabsContent
          className="flex items-center justify-end"
          value="Admin Users"
        >
          <button
            className="[background:var(--primary-radial)] px-[24px]  w-full md:w-fit flex items-center justify-center gap-[16px] text-[#FDFDFD] h-[46px] rounded-[20px] cursor-pointer"
            type="button"
          >
            <Plus size={16} />
            <p className="">Invite Admin</p>
          </button>
        </TabsContent>
      </section>

      <div className="my-[30px] md:px-[15px] relative">
        <section className="pb-3">
          <h3 className="text-[#171417] font-medium text-[1.25rem] leading-[140%] mb-[20px] px-[25px]">
            All Buyers
          </h3>
          <section className="flex items-center justify-between">
            <UserTabSelector />
            <aside className="flex items-center justify-between gap-[24px]">
              <div className="border border-[#B7B6B7] relative w-[532px] rounded-[8px]">
                <input
                  type="text"
                  placeholder="Search by name, email, service, or phone..."
                  className="w-full h-[46px] pl-[40px] pr-[16px] rounded-[8px] outline-none text-[#7B7B7B] placeholder:text-[#6B6969] placeholder:text-[.75rem] text-[.75rem] md:text-[1rem] leading-[140%] font-normal"
                />
                <Search
                  size={16}
                  className="text-[#6B6969] absolute left-4 top-4"
                />
              </div>
              {/* {activeTab === "Buyers" && ( */}
              <button
                className="border border-[#B7B6B7] flex items-center h-[48px] md:h-[46px] px-[8px] rounded-[8px] gap-2 cursor-pointer"
                type="button"
                onClick={() => setShowFilter(!showFilter)}
              >
                <ListFilter size={16} />
                <span className="md:block hidden text-[#171417] text-[1rem] leading-[140%]">
                  Filter
                </span>
              </button>
              {/* )} */}
            </aside>
          </section>
        </section>

        {/* Conditionally render BuyerFilters */}
        {activeTab === "Buyers" && showFilter && (
          <div ref={filterRef}>
            <BuyerFilters onApplyFilter={handleApplyBuyerFilter} />
          </div>
        )}

        {activeTab === "Sellers" && showFilter && (
          <div ref={filterRef}>
            <SellerFilters onApplyFilter={handleApplySellerFilter} />
          </div>
        )}

        <TabsContent value="Buyers">
          <BuyersTable />
        </TabsContent>
        <TabsContent value="Sellers">
          <SellersTable />
        </TabsContent>
        <TabsContent value="Admin Users">
          <AdminTable />
        </TabsContent>

        {modalType === "openBuyer" && <BuyerDetails />}
        {modalType === "openSeller" && <SellerDetails />}
      </div>
    </Tabs>
  );
};

export default UsersManagement;
