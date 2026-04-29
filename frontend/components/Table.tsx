"use client";

import React from "react";
import { Loader2 } from "lucide-react";

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
  emptyMessage = "No records found",
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center gap-3">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
           </svg>
        </div>
        <div>
          <p className="text-slate-900 font-bold">{emptyMessage}</p>
          <p className="text-slate-400 text-sm">There are no items matching your current view.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-0">
        <thead className="bg-[#f8fafc]">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={String(col.key)}
                className={`px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 ${idx === 0 ? 'pl-8' : ''} ${idx === columns.length - 1 ? 'pr-8 text-right' : ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((row, index) => (
            <tr
              key={keyExtractor ? keyExtractor(row, index) : index}
              className="group hover:bg-slate-50/50 transition-all duration-200"
            >
              {columns.map((col, idx) => (
                <td
                  key={String(col.key)}
                  className={`px-6 py-4 text-sm text-slate-600 font-medium ${idx === 0 ? 'pl-8' : ''} ${idx === columns.length - 1 ? 'pr-8' : ''}`}
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
