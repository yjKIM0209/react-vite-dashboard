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
import { EditableCell } from "@/components/testUi/EditableCell";

interface Props {
  data: HistoryData[];
  onAddRow: () => void;
  onUpdateRow: (
    index: number,
    field: keyof HistoryData,
    value: string | number,
  ) => void;
}

const columnHelper = createColumnHelper<HistoryData>();
/** @react-compiler-skip */
export default function TanStackHistoryGrid({
  data,
  onAddRow,
  onUpdateRow,
}: Props & { onAddRow: () => void }) {
  const searchText = useEquipmentStore((state) => state.searchText);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  // 컬럼 정의 (AG Grid의 columnDefs 역할)
  const columns = useMemo(
    () => [
      columnHelper.accessor("no", {
        header: "No.",
        minSize: 60,
        cell: (info) => {
          const displayIndex = info.row.index + 1;
          return (
            <span className="text-slate-400 font-mono">{displayIndex}</span>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: "상태",
        minSize: 80,
        cell: (info) => {
          const val = info.getValue();

          const color =
            val === "정상" || val === "신규"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700";

          return (
            <EditableCell
              value={val}
              type="select"
              options={["정상", "점검", "수리중", "대기"]}
              onUpdate={(nextVal) =>
                onUpdateRow(info.row.index, "status", nextVal)
              }
              className={`${color} px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap`}
            />
          );
        },
      }),
      columnHelper.accessor("process", { header: "공정", minSize: 100 }),
      columnHelper.accessor("factory", { header: "공장", minSize: 100 }),
      columnHelper.accessor("area", { header: "작업 구역", minSize: 120 }),
      columnHelper.group({
        id: "equipment_group",
        header: "설비 상세 정보",
        columns: [
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
              <EditableCell
                value={info.getValue()}
                onUpdate={(val) => onUpdateRow(info.row.index, "eqpName", val)}
              />
            ),
          }),
        ],
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
              ₩ {info.getValue()?.toLocaleString() ?? 0}
            </span>
          </div>
        ),
      }),
    ],
    [onUpdateRow],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: searchText, columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-md border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">컬럼 표시:</span>
          <div className="flex flex-wrap gap-1">
            {table.getAllLeafColumns().map((column) => (
              <label
                key={column.id}
                className="inline-flex items-center gap-1 bg-white border border-slate-300 px-2 py-1 rounded text-[11px] cursor-pointer hover:bg-slate-100"
              >
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  className="w-3 h-3 accent-emerald-500"
                />
                {column.columnDef.header as string}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-2 min-w-max">
          <button
            onClick={onAddRow}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-all shadow-sm flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            신규 이력 추가
          </button>
        </div>
      </div>

      <div className="flex-1 border border-slate-200 rounded-lg bg-white shadow-sm relative overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left table-auto min-w-max border-separate border-spacing-0">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="px-4 py-3 font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors select-none whitespace-nowrap "
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ width: header.getSize() }}
                    >
                      {!header.isPlaceholder && (
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{ asc: " 🔼", desc: " 🔽" }[
                            header.column.getIsSorted() as string
                          ] ?? null}
                        </div>
                      )}
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
