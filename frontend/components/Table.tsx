"use client";

import React from "react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = "No data available",
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={keyExtractor ? keyExtractor(row, index) : index}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-6 py-3 text-sm text-gray-700"
                >
                  {col.render
                    ? col.render((row as any)[String(col.key)], row)
                    : (row as any)[String(col.key)]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
