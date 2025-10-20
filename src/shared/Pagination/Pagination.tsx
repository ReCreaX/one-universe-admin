"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <section className="flex items-center justify-between w-full py-4 px-[100px]">
      {/* Previous Button */}
      <Button
        variant="outline"
        className={`rounded-[8px] border border-[#E8E3E3] px-3 py-2 flex items-center gap-2 text-[#454345] font-bold text-[.975rem] ${
          currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
        }  disabled:opacity-50`}
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        <Plus className="w-4 h-4" />
        Previous
      </Button>

      {/* Dynamic Page Info */}
      <p className="text-center text-gray-800 font-medium">
        Page {currentPage} of {totalPages}
      </p>

      {/* Next Button */}
      <Button
        variant="outline"
        className={`rounded-[8px] border border-[#E8E3E3] px-3 py-2 flex items-center gap-2 text-[#454345] font-bold text-[.975rem] ${
          currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"
        }  disabled:opacity-50`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
        <Plus className="w-4 h-4 rotate-180" />
      </Button>
    </section>
  );
};

export default Pagination;
