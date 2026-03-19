import { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { searchEquipment } from "@/api/equipment";
import type { EquipmentApi } from "@/types/equipment";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ValueFormatterParams } from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";

const formatUtcToLocal = (utcString: string | undefined | null): string => {
  if (!utcString) return "-";
  try {
    const date = new Date(utcString);
    if (isNaN(date.getTime())) return utcString;
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return utcString;
  }
};

const EquipmentMonitoringPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rowData, setRowData] = useState<EquipmentApi[]>([]);

  const handleApiCall = useCallback(async () => {
    setIsLoading(true);
    setRowData([]);

    try {
      const data = await searchEquipment();
      setRowData(data);
    } catch (err: unknown) {
      let errorMessage = "알 수 없는 에러가 발생했습니다.";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      alert(`조회 실패: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const columnDefs = useMemo<ColDef<EquipmentApi>[]>(
    () => [
      {
        field: "id",
        headerName: "UUID",
        width: 150,
        pinned: "left",
        hide: true,
      },
      {
        field: "equipmentId",
        headerName: "설비 ID",
        width: 150,
        sortable: true,
        filter: true,
        pinned: "left",
      },
      {
        field: "name",
        headerName: "설비명",
        width: 150,
        sortable: true,
        filter: true,
      },
      {
        field: "operationStartedAtUtc",
        headerName: "가동 시작 일시 (로컬)",
        width: 200,
        valueFormatter: (params: ValueFormatterParams<EquipmentApi, string>) =>
          formatUtcToLocal(params.value),
      },
      {
        field: "createdAtUtc",
        headerName: "생성 일시 (로컬)",
        width: 200,
        valueFormatter: (params: ValueFormatterParams<EquipmentApi, string>) =>
          formatUtcToLocal(params.value),
      },
      {
        field: "updatedAtUtc",
        headerName: "수정 일시 (로컬)",
        width: 200,
        hide: false,
        valueFormatter: (params: ValueFormatterParams<EquipmentApi, string>) =>
          formatUtcToLocal(params.value),
      },
      {
        field: "clientTimezone",
        headerName: "타임존",
        width: 150,
        filter: true,
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    }),
    [],
  );

  return (
    <div
      style={{
        padding: "2rem",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>장비 실시간 모니터링 조회 테스트</h1>
        <button
          onClick={handleApiCall}
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isLoading ? "조회 중..." : "조회"}
        </button>
      </div>

      <div style={{ flex: 1, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          theme={themeQuartz}
          loading={isLoading}
          selectionColumnDef={{
            width: 50,
            minWidth: 50,
            maxWidth: 50,
            pinned: "left",
          }}
          autoSizeStrategy={{
            type: "fitGridWidth",
            defaultMinWidth: 100,
          }}
          rowSelection={{
            mode: "multiRow",
            headerCheckbox: true,
            enableClickSelection: false,
          }}
        />
      </div>
    </div>
  );
};

export default EquipmentMonitoringPage;
