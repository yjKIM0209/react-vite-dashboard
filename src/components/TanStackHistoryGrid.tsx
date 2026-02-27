import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import type { HistoryData } from "@/types";

interface Props {
  data: HistoryData[];
  searchText: string;
}

const columnHelper = createColumnHelper<HistoryData>();
/** @react-compiler-skip */
export default function TanStackHistoryGrid({ data, searchText }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // 컬럼 정의 (AG Grid의 columnDefs 역할)
  const columns = useMemo(
    () => [
      columnHelper.accessor("no", {
        header: "No.",
        cell: (info) => (
          <span className="text-slate-400 font-mono">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "상태",
        cell: (info) => {
          const val = info.getValue();
          const color =
            val === "정상"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700";
          return (
            <span
              className={`${color} px-2 py-0.5 rounded-full text-xs font-bold`}
            >
              {val}
            </span>
          );
        },
      }),
      columnHelper.accessor("eqpId", {
        header: "설비 ID",
        cell: (info) => (
          <span className="font-semibold text-slate-700">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("eqpName", {
        header: "설비명",
      }),
      columnHelper.accessor("repairCost", {
        header: "유지보수비",
        cell: (info) => (
          <span className="text-blue-600 font-mono">
            ₩ {info.getValue().toLocaleString()}
          </span>
        ),
      }),
      columnHelper.accessor("startTime", {
        header: "시작 시간",
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: searchText },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 border border-slate-200 rounded-lg bg-white overflow-auto shadow-sm relative">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{ asc: " 🔼", desc: " 🔽" }[
                        header.column.getIsSorted() as string
                      ] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-blue-50/30 transition-colors group"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-slate-600">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 (AG Grid가 자동으로 해주던 부분) */}
      <div className="flex items-center justify-between px-2 text-sm text-slate-500 shrink-0 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-30 hover:bg-white"
          >
            이전
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-30 hover:bg-white"
          >
            다음
          </button>
        </div>
        <span>
          페이지 {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}
