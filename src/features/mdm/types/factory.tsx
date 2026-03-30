// src/features/mdm/types/factory.tsx
import type { ColDef, ICellRendererParams } from "ag-grid-community";

export interface FactoryData {
  factoryId: string;
  factoryName: string;
  division: string;
  useYn: "Y" | "N";
  description: string;
  updatedAt: string;
  updatedBy: string;
}

const UseYnBadge = (params: ICellRendererParams) => {
  const value = params.value;

  if (!value) return null;

  return <div className="flex items-center h-full">{value}</div>;
};

export const factoryColumnDefs: ColDef<FactoryData>[] = [
  {
    headerName: "No",
    width: 70,
    valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
  },
  {
    field: "factoryId",
    headerName: "공장 ID",
  },
  { field: "factoryName", headerName: "공장명", editable: true },
  { field: "division", headerName: "사업부", editable: true },
  {
    field: "useYn",
    headerName: "사용 여부",
    width: 100,
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Y", "N"] },
    cellRenderer: UseYnBadge,
  },
  { field: "description", headerName: "비고", width: 200, editable: true },
  { field: "updatedAt", headerName: "수정일시" },
  { field: "updatedBy", headerName: "수정자" },
];
