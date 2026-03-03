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
import { useEquipmentStore } from "@/store/useEquipmentStore";

interface Props {
  data: HistoryData[];
}

const columnHelper = createColumnHelper<HistoryData>();
/** @react-compiler-skip */
export default function TanStackHistoryGrid({ data }: Props) {
  const searchText = useEquipmentStore((state) => state.searchText);
  const [sorting, setSorting] = useState<SortingState>([]);

  // 컬럼 정의 (AG Grid의 columnDefs 역할)
  const columns = useMemo(
    () => [
      columnHelper.accessor("no", {
        header: "No.",
        minSize: 60,
        cell: (info) => (
          <span className="text-slate-400 font-mono">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "상태",
        minSize: 80,
        cell: (info) => {
          const val = info.getValue();
          const color =
            val === "정상"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700";
          return (
            <span
              className={`${color} px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap`}
            >
              {val}
            </span>
          );
        },
      }),
      columnHelper.accessor("process", { header: "공정", minSize: 100 }),
      columnHelper.accessor("factory", { header: "공장", minSize: 100 }),
      columnHelper.accessor("area", { header: "작업 구역", minSize: 120 }),
      columnHelper.accessor("eqpId", {
        header: "설비 ID",
        minSize: 120,
        cell: (info) => (
          <span className="font-semibold text-slate-700 whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("eqpName", {
        header: "설비명",
        minSize: 150,
        cell: (info) => (
          <span className="whitespace-nowrap">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("startTime", {
        header: "시작 시간",
        minSize: 160,
        cell: (info) => (
          <span className="text-slate-500 text-xs font-mono">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("endTime", {
        header: "종료 시간",
        minSize: 160,
        cell: (info) => (
          <span className="text-slate-500 text-xs font-mono">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("duration", {
        header: "소요 시간",
        minSize: 80,
        cell: (info) => (
          <span className="font-mono text-slate-600">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("repairCost", {
        header: "유지보수비",
        minSize: 120,
        cell: (info) => (
          <div className="text-right pr-4 whitespace-nowrap">
            <span className="text-blue-600 font-mono font-medium">
              ₩ {info.getValue().toLocaleString()}
            </span>
          </div>
        ),
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
      <div className="flex-1 border border-slate-200 rounded-lg bg-white shadow-sm relative overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left table-auto min-w-max border-separate border-spacing-0">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors select-none whitespace-nowrap"
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ width: header.getSize() }}
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
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-slate-600 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 영역 */}
      <div className="flex items-center justify-between px-2 text-sm text-slate-500 shrink-0 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-30 hover:bg-white transition-colors"
          >
            이전
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-30 hover:bg-white transition-colors"
          >
            다음
          </button>
        </div>
        <span className="font-medium">
          페이지 {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}
