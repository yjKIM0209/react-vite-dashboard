// src/pages/mdm/FactoryManagementPage.tsx
import { useCallback, useState, useMemo } from "react";
import { factoryApi } from "@/features/mdm/api/factoryApi";
import { PageShell } from "@/shared/components/layout/PageShell";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { ControlBar } from "@/shared/components/layout/ControlBar";
import { ActionBar } from "@/shared/components/layout/ActionBar";
import { useCurrentMenu } from "@/features/layout/hooks/useCurrentMenu";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SearchPopover } from "@/shared/components/layout/SearchPopover";
import { FactoryFilterForm } from "@/features/mdm/components/FactoryFilterForm";
import CommonGrid from "@/shared/components/table/AgGrid";
import {
  factoryColumnDefs,
  type FactoryData,
} from "@/features/mdm/types/factory";
import { GridHeader } from "@/shared/components/layout/GridHeader";

export default function FactoryManagementPage() {
  const { title, breadcrumbs } = useCurrentMenu();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [gridSearch, setGridSearch] = useState("");
  const [rowData, setRowData] = useState<FactoryData[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const [searchParams, setSearchParams] = useState({
    plantId: "",
    validState: "Valid",
  });

  const handleSearch = useCallback(async () => {
    try {
      console.log("조회 요청 파라미터:", searchParams);

      const data = await factoryApi.searchPlants({
        plantId: searchParams.plantId || undefined,
        validState: searchParams.validState,
      });

      const formattedData = Array.isArray(data) ? data : data ? [data] : [];
      setRowData(formattedData);

      setIsPopoverOpen(false);
    } catch (error) {
      console.error("조회 중 오류 발생:", error);
      alert("조회에 실패했습니다. 서버 상태를 확인하세요.");
    }
  }, [searchParams]);

  const handleAddRow = useCallback(() => {
    const newRow: FactoryData = {
      plantId: "", // 필수값
      plantNameKoKr: "",
      plantNameEnUs: "",
      plantNameZhCn: "",
      plantNameViVn: "",
      plantNameLoLo: "",
      description: "",
      enterpriseId: "",
      address: "",
      phone: "",
      fax: "",
      language: "ko-KR",
      startBusinessHour: "09:00",
      validState: "Valid", // 필수값 // 기본값 '유효'
      creator: "admin", // 필요시 현재 사용자 세션 정보
      created_time: "",
      modifier: null,
      modified_time: null,
    };

    setRowData((prev) => [newRow, ...prev]);
  }, []);

  const onCellValueChanged = useCallback((params: any) => {
    const normalize = (v: unknown) =>
      v === null || v === undefined ? "" : String(v);
    const oldVal = normalize(params.oldValue);
    const newVal = normalize(params.newValue);

    if (oldVal !== newVal) {
      if (params.data.created_time) {
        params.data.isUpdated = true;

        if (!params.data.modifiedFields) {
          params.data.modifiedFields = new Set();
        }
        params.data.modifiedFields.add(params.colDef.field);
      }

      params.api.refreshCells({
        rowNodes: [params.node],
        force: true,
      });
    }
  }, []);

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  const handleDeleteRow = useCallback(() => {
    if (!gridApi) return;

    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("삭제할 행을 선택해주세요.");
      return;
    }

    const idsToDelete = selectedRows
      .filter((row: any) => row.created_time)
      .map((row: any) => row.plantId);

    setDeletedIds((prev) => [...prev, ...idsToDelete]);

    const remainingRows = rowData.filter((row) => !selectedRows.includes(row));
    setRowData(remainingRows);
  }, [gridApi, rowData]);

  const handleSave = useCallback(async () => {
    if (!gridApi) return;

    const allRows: FactoryData[] = [];
    gridApi.forEachNode((node: any) => allRows.push(node.data));

    const idsToProcess = [...deletedIds];
    const newItems = allRows.filter((row) => !row.created_time);
    const updatedItems = allRows.filter(
      (row) => (row as any).isUpdated === true && row.plantId,
    );

    const invalidItems = newItems.filter((row) => !row.plantId?.trim());
    if (invalidItems.length > 0) {
      alert(`공장 ID는 필수값입니다. (${invalidItems.length}건)`);
      return;
    }

    if (
      idsToProcess.length === 0 &&
      newItems.length === 0 &&
      updatedItems.length === 0
    ) {
      alert("변경사항이 없습니다.");
      return;
    }

    try {
      setDeletedIds([]);

      for (const id of idsToProcess) {
        await factoryApi.deletePlant(id);
      }

      for (const item of newItems) {
        await factoryApi.registerPlant(item);
      }

      for (const item of updatedItems) {
        const sanitizedItem = Object.fromEntries(
          Object.entries(item).map(([key, value]) => [
            key,
            value === null || value === undefined ? "" : value,
          ]),
        );

        await factoryApi.updatePlant(sanitizedItem as FactoryData);
      }

      alert("성공적으로 저장되었습니다.");

      setDeletedIds([]);
      handleSearch();
    } catch (error: any) {
      setDeletedIds(idsToProcess);
      alert(`저장 실패: ${error.response?.data?.message || error.message}`);
    }
  }, [gridApi, deletedIds, handleSearch]);

  const gridOptions = useMemo(
    () => ({
      quickFilterText: gridSearch,
      getRowClass: (params: any) => {
        if (params.data && !params.data.created_time) {
          return "row-new";
        }
        return undefined;
      },
    }),
    [gridSearch],
  );

  return (
    <PageShell>
      <PageHeader
        title={title}
        breadcrumbs={breadcrumbs}
        actions={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="그리드 내 결과 검색"
              value={gridSearch}
              onChange={(e) => setGridSearch(e.target.value)}
              className="w-72 pl-9 bg-slate-50 border-slate-300 focus:bg-white transition-all"
            />
          </div>
        }
      />

      <ControlBar
        left={
          <div className="flex items-center gap-2">
            <SearchPopover
              isOpen={isPopoverOpen}
              onOpenChange={setIsPopoverOpen}
              title={`${title} 조회 조건`}
              onSearch={handleSearch}
              width={320}
            >
              <FactoryFilterForm
                values={searchParams}
                onChange={(newValues) =>
                  setSearchParams((prev) => ({ ...prev, ...newValues }))
                }
              />
            </SearchPopover>
          </div>
        }
        right={
          <ActionBar
            onSearch={handleSearch}
            onAdd={handleAddRow}
            onDelete={handleDeleteRow}
            onSave={handleSave}
            onExcel={() => console.log("엑셀")}
          />
        }
      />

      <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <GridHeader title={title} count={rowData.length} />
        <div className="flex-1">
          <CommonGrid<FactoryData>
            rowData={rowData}
            columnDefs={factoryColumnDefs}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            gridOptions={{
              ...gridOptions,
              rowSelection: "multiple",
              suppressRowClickSelection: true,
              stopEditingWhenCellsLoseFocus: true,
            }}
          />
        </div>
      </div>
    </PageShell>
  );
}
