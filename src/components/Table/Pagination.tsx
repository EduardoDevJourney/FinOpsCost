interface PaginationProps {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  onPageSizeChange: (n: number) => void;
  onPageChange: (page: number) => void;
  options?: number[];
}

export default function Pagination({
  pageSize,
  currentPage,
  totalItems,
  onPageSizeChange,
  onPageChange,
  options = [10, 20, 50, 100, 500],
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="flex items-center justify-between mt-4">
      {/* Seletor de tamanho da página */}
      <div className="flex items-center space-x-2">
        <select
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1); // resetar para página 1
          }}
        >
          {options.map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
          <option value={totalItems}>All ({totalItems})</option>
        </select>
      </div>

      {/* Controles de página */}
      <div className="space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ‹ Prev
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next ›
        </button>
      </div>
    </div>
  );
}
