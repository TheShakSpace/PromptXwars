/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

export interface TableColumnSchema<T> {
  id: string;
  header: string;
  accessor: (row: T) => any;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableEngineProps<T> {
  data: T[];
  columns: TableColumnSchema<T>[];
  title?: string;
  searchPlaceholder?: string;
  enableSearch?: boolean;
  filterKey?: keyof T;
  filterOptions?: string[];
  pageSize?: number;
}

export function TableEngine<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchPlaceholder = "Filter entries...",
  enableSearch = true,
  filterKey,
  filterOptions,
  pageSize = 5,
}: TableEngineProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting Handler
  const handleSort = (colId: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortBy === colId) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(colId);
      setSortOrder("asc");
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filter by text search
    if (enableSearch && searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) => String(val).toLowerCase().includes(term))
      );
    }

    // Filter by custom category
    if (filterKey && activeFilter) {
      result = result.filter((row) => String(row[filterKey]) === activeFilter);
    }

    // Sort entries
    if (sortBy) {
      const targetCol = columns.find((c) => c.id === sortBy);
      if (targetCol) {
        result.sort((a, b) => {
          const valA = targetCol.accessor(a);
          const valB = targetCol.accessor(b);

          if (typeof valA === "number" && typeof valB === "number") {
            return sortOrder === "asc" ? valA - valB : valB - valA;
          }
          return sortOrder === "asc"
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
        });
      }
    }

    return result;
  }, [data, columns, searchTerm, sortBy, sortOrder, activeFilter, filterKey, enableSearch]);

  // Pagination bounds
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize) || 1;

  return (
    <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 backdrop-blur-xl flex flex-col gap-4">
      
      {/* Header controls rail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {title && (
          <div>
            <h4 className="font-sans font-bold text-xs uppercase tracking-tight text-white/90">{title}</h4>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5">
          {enableSearch && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-neutral-950/60 border border-white/5 rounded-xl py-1.5 pl-8.5 pr-4 text-[11px] font-mono outline-none focus:border-white/20 transition-all text-white placeholder:text-white/20 w-44 sm:w-56"
              />
            </div>
          )}

          {filterKey && filterOptions && (
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3 text-white/30" />
              <select
                value={activeFilter}
                onChange={(e) => {
                  setActiveFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-neutral-950/60 border border-white/5 rounded-xl py-1.5 px-3 text-[10px] font-mono text-white/70 outline-none"
              >
                <option value="">ALL PARAMS</option>
                {filterOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-neutral-950 text-white">
                    {opt.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Table view */}
      <div className="overflow-x-auto rounded-xl border border-white/5 bg-neutral-950/20">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5 font-mono text-[9px] text-white/40 uppercase tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.id}
                  onClick={() => handleSort(col.id, col.sortable)}
                  className={`py-3 px-4 select-none ${col.sortable ? "cursor-pointer hover:bg-white/[0.04] text-white/60" : ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {sortBy === col.id && (
                      sortOrder === "asc" ? <ChevronUp className="w-3 h-3 text-[#4F8CFF]" /> : <ChevronDown className="w-3 h-3 text-[#4F8CFF]" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-white/30 font-mono text-[10px] uppercase">
                  No telemetry units detected matching parameters.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="border-b border-white/5 hover:bg-white/[0.01] transition-all text-white/80"
                >
                  {columns.map((col) => {
                    const cellVal = col.accessor(row);
                    return (
                      <td key={col.id} className="py-3.5 px-4 font-mono text-[10.5px]">
                        {col.render ? col.render(cellVal, row) : String(cellVal)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer dynamic navigation pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/5 pt-3.5 font-mono text-[9px] text-white/40">
          <span>
            PAGE {currentPage} OF {totalPages} ({filteredAndSortedData.length} TOTAL RECORDS)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="py-1 px-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-white cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed uppercase font-bold"
            >
              PREV
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="py-1 px-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-white cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed uppercase font-bold"
            >
              NEXT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
