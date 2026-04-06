// src/features/history/components/HistoryGrid.tsx
import { useMemo, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  type ColDef,
  type ValueFormatterParams,
  type ICellRendererParams,
} from "ag-grid-community";
import { PlusCircle, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HistoryData } from "@/types";

// AG Grid 모듈 등록
ModuleRegistry.registerModules([AllCommunityModule]);

const EQP_NAME_MAP: Record<string, string> = {
  "EQP-1001": "믹서기 #1",
  "EQP-1002": "믹서기 #2",
  "EQP-1003": "충진기 #1",
  "EQP-1004": "비전검사기 #1",
  "EQP-1005": "중량검사기 #1",
};

const generateInitialData = (): HistoryData[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return Array.from({ length: 50 }).map((_, i) => {
    const eqpId = `EQP-${1001 + i}`;
    const eqpName = EQP_NAME_MAP[eqpId] || `설비-${1001 + i}`;
    const startTime = `${year}-${month}-${day} 10:00`;
    const endTime = `${year}-${month}-${day} 11:00`;

    return {
      no: i + 1,
      status: i % 5 === 0 ? "점검" : "정상",
      process: ["믹싱", "충진", "포장", "검사"][i % 4],
      factory: "창원공장",
      area: "A-Line",
      eqpId: eqpId,
      eqpName: eqpName,
      startTime: startTime,
      endTime: endTime,
      repairCost: Math.floor(Math.random() * 5000) + 500,
      duration: "01:00",
      memo: "",
    };
  });
};

interface HistoryGridProps {
  filterEqpIds: string[];
  dateRange: { start: string; end: string };
  searchText: string;
}

export default function HistoryGrid({
  filterEqpIds,
  dateRange,
  searchText,
}: HistoryGridProps) {
  const [rowData, setRowData] = useState<HistoryData[]>(generateInitialData());

  const addNewRow = useCallback(() => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newRow: HistoryData = {
      no: rowData.length + 1,
      status: "신규",
      process: "미지정",
      factory: "창원공장",
      area: "A-Line",
      eqpId: "NEW-EQP",
      eqpName: "신규 등록 설비",
      startTime: formattedDate,
      endTime: "",
      repairCost: 0,
      duration: "00:00",
      memo: "신규 추가됨",
    };
    setRowData((prev) => [newRow, ...prev]);
  }, [rowData.length]);

  const myTheme = themeQuartz.withParams({
    accentColor: "#2563eb",
    headerBackgroundColor: "#f8fafc",
  });

  const filteredData = useMemo(() => {
    const data = [...rowData];

    return data.filter((item) => {
      if (item.eqpId === "NEW-EQP") return true;

      const matchesEqp =
        filterEqpIds.length === 0 || filterEqpIds.includes(item.eqpId);

      const start = new Date(dateRange.start).getTime();
      const end = new Date(dateRange.end).getTime();
      const itemTime = new Date(item.startTime.replace(/-/g, "/")).getTime();
      const matchesDate = itemTime >= start && itemTime <= end;

      return matchesEqp && matchesDate;
    });
  }, [rowData, filterEqpIds, dateRange]);

  const columnDefs = useMemo<ColDef<HistoryData>[]>(
    () => [
      {
        headerName: "No.",
        width: 60,
        // pinned: "left",
        filter: false,
        // checkboxSelection: true,
        // headerCheckboxSelection: true,
        valueGetter: (params) => {
          if (params.node && params.node.rowIndex !== null) {
            return params.node.rowIndex + 1;
          }
          return null;
        },
      },
      {
        field: "status",
        headerName: "상태",
        width: 100,
        cellRenderer: (params: ICellRendererParams<HistoryData>) => {
          if (!params.value) return null;
          const color =
            params.value === "점검"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700";
          return (
            <span
              className={`${color} px-2 py-1 rounded-full text-xs font-bold`}
            >
              {params.value}
            </span>
          );
        },
      },
      {
        headerName: "설비 상세 정보",
        headerClass: "header-group-center",
        marryChildren: true,
        children: [
          {
            field: "eqpId",
            headerName: "설비 ID",
            width: 110,
            editable: true,
            cellClass: "font-semibold text-slate-600",
          },
          {
            field: "eqpName",
            headerName: "설비명",
            width: 130,
            editable: true,
          },
        ],
      },
      {
        field: "process",
        headerName: "공정",
        width: 120,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["믹싱", "충진", "포장", "검사"] },
      },
      {
        field: "repairCost",
        headerName: "유지보수비",
        width: 130,
        editable: true,
        valueFormatter: (params: ValueFormatterParams<HistoryData>) => {
          return params.value ? `₩ ${params.value.toLocaleString()}` : "₩ 0";
        },
        cellClass: "text-right text-blue-700 font-mono",
      },
      {
        field: "memo",
        headerName: "비고",
        minWidth: 180,
        flex: 1,
        editable: true,
        cellEditor: "agTextCellEditor",
      },
      { field: "startTime", headerName: "시작 시간", flex: 1, minWidth: 150 },
      { field: "endTime", headerName: "종료 시간", flex: 1, minWidth: 150 },
    ],
    [],
  );

  return (
    <div className="w-full h-full flex flex-col p-2 gap-3">
      <GridHeader count={filteredData.length} onAdd={addNewRow} />

      <div className="flex-1 w-full min-h-400px">
        <AgGridReact<HistoryData>
          theme={myTheme}
          rowData={filteredData}
          columnDefs={columnDefs}
          quickFilterText={searchText}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            floatingFilter: true,
            editable: true,
          }}
          rowSelection={{ mode: "multiRow", headerCheckbox: true }}
          pagination={true}
          paginationPageSizeSelector={[10, 20, 50]}
          paginationPageSize={20}
          rowHeight={45}
          headerHeight={48}
        />
      </div>
    </div>
  );
}

function GridHeader({ count, onAdd }: { count: number; onAdd: () => void }) {
  return (
    <div className="flex justify-between items-center px-2">
      <div className="flex items-center gap-2">
        <List className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-bold text-slate-600">
          조회 결과 <span className="text-blue-600 ml-1">{count}</span>건
        </h3>
      </div>

      <Button
        onClick={onAdd}
        variant="success"
        size="sm"
        className="font-bold shadow-sm"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        신규 이력 추가
      </Button>
    </div>
  );
}
