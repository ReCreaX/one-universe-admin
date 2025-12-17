"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PaginationProps {
  totalPages: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

const Pagination = ({
  totalPages,
  initialPage = 1,
  onPageChange,
}: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePrev = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  };

  return (
    <section className="flex items-center justify-between w-full py-4 px-6 md:px-[100px]">
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`rounded-[8px] border border-[#E8E3E3] px-3 py-2 flex items-center gap-2 font-dm-sans font-bold text-[.975rem] transition-colors ${
          currentPage === 1
            ? "cursor-not-allowed opacity-50 text-[#B7B6B7]"
            : "cursor-pointer text-[#454345] hover:bg-gray-50"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Dynamic Page Info */}
      <p className="text-center text-gray-800 font-dm-sans font-medium">
        Page <span className="font-bold text-[#154751]">{currentPage}</span> of{" "}
        <span className="font-bold text-[#154751]">{totalPages}</span>
      </p>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`rounded-[8px] border border-[#E8E3E3] px-3 py-2 flex items-center gap-2 font-dm-sans font-bold text-[.975rem] transition-colors ${
          currentPage === totalPages
            ? "cursor-not-allowed opacity-50 text-[#B7B6B7]"
            : "cursor-pointer text-[#454345] hover:bg-gray-50"
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </section>
  );
};

export default Pagination;