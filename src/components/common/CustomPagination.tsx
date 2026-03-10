import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomButton from "./CustomButton";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-200 mt-4">
      <div className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-800">{startItem}</span>{" "}
        to <span className="font-medium text-slate-800">{endItem}</span> of{" "}
        <span className="font-medium text-slate-800">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-2">
        <CustomButton
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 px-3 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </CustomButton>

        <div className="flex items-center gap-1 mx-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
             // Logic to show a window of pages around current page
             let pageNum = i + 1;
             if (totalPages > 5) {
                 if (currentPage > 3) {
                     pageNum = currentPage - 2 + i;
                 }
                 if (pageNum > totalPages) {
                     pageNum = totalPages - 4 + i; // Stick to end
                 }
             }
             
             // Ensure we don't go out of bounds (simple version)
             if (pageNum > totalPages) return null;

             return (
                <CustomButton
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                >
                {pageNum}
                </CustomButton>
             );
          })}
        </div>

        <CustomButton
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 px-3 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </CustomButton>
      </div>
    </div>
  );
};

export default React.memo(CustomPagination);
