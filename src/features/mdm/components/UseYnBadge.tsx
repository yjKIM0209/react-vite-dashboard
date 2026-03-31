// src/features/mdm/components/UseYnBadge.tsx
import type { ICellRendererParams } from "ag-grid-community";

export const UseYnBadge = (params: ICellRendererParams) => {
  const value = params.value;
  
  if (!value) return null;

  return <div className="flex items-center h-full">{value}</div>;
};
