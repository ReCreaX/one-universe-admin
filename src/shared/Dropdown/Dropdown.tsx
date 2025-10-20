"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  placeholder: string;
  options: string[];
  onSelect: (value: string) => void;
}

export default function Dropdown({ placeholder, options, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Label */}

      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {/* Options */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md">
          {options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(option)}
              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <div
                className={`h-3 w-3 rounded-full border mr-2 ${
                  selected === option ? "border-[5px] border-gray-600" : "border-gray-400"
                }`}
              />
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
