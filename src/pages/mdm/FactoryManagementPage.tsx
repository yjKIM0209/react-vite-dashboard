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
import { toast } from "sonner";
import { ConfirmDialog } from "@/shared/components/modal/ConfirmDialog";
import { LoadingOverlay } from "@/shared/components/layout/LoadingOverlay";

type RowStatus = "C" | "U" | "D" | "N";

interface ExtendedFactoryData extends FactoryData {
  rowStatus?: RowStatus;
  modifiedFields?: Set<string>;
}

export default function FactoryManagementPage() {
  const { title, breadcrumbs } = useCurrentMenu();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [gridSearch, setGridSearch] = useState("");
  const [rowData, setRowData] = useState<ExtendedFactoryData[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    plantId: "",
    validState: "Valid",
  });

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await factoryApi.searchPlants({
        plantId: searchParams.plantId || undefined,
        validState: searchParams.validState,
      });

      const formattedData = (
        Array.isArray(data) ? data : data ? [data] : []
      ).map((item: any) => ({ ...item, rowStatus: "N" as RowStatus }));

      setRowData(formattedData);
      setDeletedIds([]);
      setIsPopoverOpen(false);
    } catch (error) {
      console.error("조회 중 오류 발생:", error);
      toast.warning("조회에 실패했습니다. 서버 상태를 확인하세요.");
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  const handleAddRow = useCallback(() => {
    const newRow = {
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
      rowStatus: "C",
    } as ExtendedFactoryData;

    setRowData((prev) => [newRow, ...prev]);
  }, []);

  const onCellValueChanged = useCallback((params: any) => {
    const { data, oldValue, newValue, node, colDef } = params;
    if (oldValue === newValue) return;

    if (data.rowStatus !== "C") {
      data.rowStatus = "U";
      data.modifiedFields = (data.modifiedFields || new Set()).add(colDef.field);
    }
    params.api.refreshCells({ rowNodes: [node], columns: [colDef.field], force: true });
  }, []);

  const handleDeleteRow = useCallback(() => {
    if (!gridApi) return;

    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0)
      return toast.error("삭제할 행을 선택해주세요.");

    const idsToTrack = selectedRows
      .filter((row: ExtendedFactoryData) => row.rowStatus !== "C")
      .map((row: ExtendedFactoryData) => row.plantId);

    setDeletedIds((prev) => [...prev, ...idsToTrack]);

    const remainingRows = rowData.filter((row) => !selectedRows.includes(row));
    setRowData(remainingRows);
  }, [gridApi, rowData]);

  const handleSave = useCallback(() => {
    if (!gridApi) return;

    const allRows: ExtendedFactoryData[] = [];
    gridApi.forEachNode((node: any) => allRows.push(node.data));

    const createdItems = allRows.filter((row) => row.rowStatus === "C");
    const updatedItems = allRows.filter((row) => row.rowStatus === "U");
    const invalidItems = createdItems.filter((row) => !row.plantId?.trim());
    if (invalidItems.length > 0)
      return toast.warning("공장 ID는 필수값입니다.");

    if (
      deletedIds.length === 0 &&
      createdItems.length === 0 &&
      updatedItems.length === 0
    ) {
      return toast.warning("변경사항이 없습니다.");
    }

    setIsSaveDialogOpen(true);
  }, [gridApi, deletedIds]);

  const executeSave = async () => {
    setIsLoading(true);

    try {
      await Promise.all(deletedIds.map((id) => factoryApi.deletePlant(id)));

      const allItems: ExtendedFactoryData[] = [];
      gridApi.forEachNode((node: any) => allItems.push(node.data));

      const sanitize = (item: any) =>
        Object.fromEntries(Object.entries(item).map(([k, v]) => [k, v ?? ""]));

      const savePromises = [
        ...allItems
          .filter((r) => r.rowStatus === "C")
          .map((r) =>
            factoryApi.registerPlant(sanitize(r) as unknown as FactoryData),
          ),
        ...allItems
          .filter((r) => r.rowStatus === "U")
          .map((r) =>
            factoryApi.updatePlant(sanitize(r) as unknown as FactoryData),
          ),
      ];

      await Promise.all(savePromises);

      toast.success("성공적으로 저장되었습니다.");
      handleSearch();
    } catch (error: any) {
      toast.error(`저장 실패: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onGridReady = (params: any) => setGridApi(params.api);

  const gridOptions = useMemo(
    () => ({
      quickFilterText: gridSearch,
      getRowClass: (params: any) => {
        if (params.data?.rowStatus === "C") return "row-new";
        return undefined;
      },
      defaultColDef: {
        cellClassRules: {
          "cell-modified": (params: any) => {
            return (
              params.data?.rowStatus === "U" &&
              params.data?.modifiedFields?.has(params.colDef.field)
            );
          },
        },
      },
    }),
    [gridSearch],
  );

  return (
    <PageShell>
      <LoadingOverlay isLoading={isLoading} />

      <PageHeader
        title={title}
        breadcrumbs={breadcrumbs}
        actions={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="결과 내 검색"
              value={gridSearch}
              onChange={(e) => setGridSearch(e.target.value)}
              className="w-72 pl-9 bg-slate-50 border-slate-300 focus:bg-white transition-all"
            />
          </div>
        }
      />

      <ControlBar
        left={
          <SearchPopover
            isOpen={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
            title={`${title} 조회 조건`}
            onSearch={handleSearch}
            width={320}
          >
            <FactoryFilterForm
              values={searchParams}
              onChange={(vals) =>
                setSearchParams((prev) => ({ ...prev, ...vals }))
              }
            />
          </SearchPopover>
        }
        right={
          <ActionBar
            onSearch={handleSearch}
            onAdd={handleAddRow}
            onDelete={handleDeleteRow}
            onSave={handleSave}
          />
        }
      />

      <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <GridHeader title={title} count={rowData.length} />
        <div className="flex-1">
          <CommonGrid<ExtendedFactoryData>
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

      <ConfirmDialog
        isOpen={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        title="변경사항 저장"
        description="수정, 추가 또는 삭제된 데이터를 서버에 반영하시겠습니까?"
        onConfirm={executeSave}
      />
    </PageShell>
  );
}
