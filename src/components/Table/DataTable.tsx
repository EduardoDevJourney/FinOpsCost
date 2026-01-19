import React from "react";

export interface Column<T> {
  /** Cabeçalho da coluna */
  header: string;
  /** Chave do objeto T ou função que recebe a linha e retorna o conteúdo */
  accessor: keyof T | ((row: T) => React.ReactNode);
  /** Largura opcional */
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export default function DataTable<T extends {}>({
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto max-h-[600px]">
      <table className="min-w-full rounded-lg">
        <thead className="">
          <tr className="border-1 border-gray-100 sticky top-0 bg-white">
            {columns.map((col) => (
              <th
                key={col.header}
                className="px-4 py-2 text-left text-sm font-medium text-gray-600"
                style={col.width ? { width: col.width } : {}}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={`border-1 border-gray-100 odd:bg-purple-500 odd:text-white even:bg-white even:text-gray-700`}
            >
              {columns.map((col) => {
                const cell =
                  typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row[col.accessor] as React.ReactNode);
                return (
                  <td
                    key={col.header}
                    className="px-4 py-3 text-sm"
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
