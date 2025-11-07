import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers: (number | string)[] = [];
  const maxPageNumbersToShow = window.innerWidth < 640 ? 3 : 5; // 3 on mobile, 5 on desktop

  if (totalPages <= maxPageNumbersToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxPageNumbersToShow / 2)
    );
    const endPage = Math.min(
      totalPages,
      startPage + maxPageNumbersToShow - 1
    );

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }
  }

  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 overflow-x-auto">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 sm:px-4 py-2 rounded-lg bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm sm:text-base"
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Prev</span>
      </button>

      {pageNumbers.map((pageNumber, index) =>
        typeof pageNumber === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(pageNumber)}
            className={`px-2 sm:px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
              pageNumber === currentPage
                ? "bg-[var(--medium-blue)] text-[var(--near-white)]"
                : "bg-gray-200 text-[var(--dark-blue)] hover:bg-gray-300"
            }`}
          >
            {pageNumber}
          </button>
        ) : (
          <span key={index} className="px-2 sm:px-4 py-2 text-[var(--dark-blue)] text-sm sm:text-base">
            {pageNumber}
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-4 py-2 rounded-lg bg-[var(--dark-blue)] text-[var(--near-white)] hover:bg-[var(--dark-blue)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm sm:text-base"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">Next</span>
      </button>
    </div>
  );
};

export default Pagination;
