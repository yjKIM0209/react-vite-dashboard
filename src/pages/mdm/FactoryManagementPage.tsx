// src/pages/mdm/FactoryManagementPage.tsx
import { useCallback, useState, useMemo } from "react";
import { factoryApi } from "@/features/mdm/api/factoryApi";
import { PageShell } from "@/shared/components/layout/PageShell";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { ControlBar } from "@/shared/components/layout/ControlBar";
import { ActionBar } from "@/shared/components/layout/ActionBar";
// import { SideSearchSheet } from "@/shared/components/layout/SideSearchSheet";
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

export default function FactoryManagementPage() {
  const { title, breadcrumbs } = useCurrentMenu();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [gridSearch, setGridSearch] = useState("");
  const [rowData, setRowData] = useState<FactoryData[]>([]);

  const [searchParams, setSearchParams] = useState({
    plantId: "",
    validState: "Valid", // 기본값을 'Valid'로 설정하여 유효한 공장만 조회
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
      // setIsSheetOpen(false);
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
    if (params.data.created_time) {
      params.data.isUpdated = true;
    }
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const newItems = rowData.filter(
        (row) => row.plantId && !row.created_time,
      );
      const updatedItems = rowData.filter(
        (row) => (row as any).isUpdated === true,
      );

      if (newItems.length === 0 && updatedItems.length === 0) {
        alert("변경사항이 없습니다.");
        return;
      }

      for (const item of newItems) {
        await factoryApi.registerPlant(item);
      }

      for (const item of updatedItems) {
        await factoryApi.updatePlant(item);
      }

      alert("성공적으로 저장되었습니다.");
      handleSearch();
    } catch (error: any) {
      console.error("저장 오류:", error);
      alert(`저장 실패: ${error.response?.data?.message || error.message}`);
    }
  }, [rowData, handleSearch]);

  const gridOptions = useMemo(
    () => ({
      quickFilterText: gridSearch,
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

            {/* 우측 슬라이드형 검색 (동일하게 Props 연결) */}
            {/* <SideSearchSheet
              isOpen={isSheetOpen}
              onOpenChange={setIsSheetOpen}
              title={`${title} 조회 조건`}
              onSearch={handleSearch}
              width={400}
            >
              <div className="py-4">
                <FactoryFilterForm 
                  values={searchParams} 
                  onChange={(newValues) => setSearchParams(prev => ({ ...prev, ...newValues }))} 
                />
              </div>
            </SideSearchSheet> */}
          </div>
        }
        right={
          <ActionBar
            onSearch={handleSearch}
            onAdd={handleAddRow}
            onDelete={() => console.log("삭제")}
            onSave={handleSave}
            onExcel={() => console.log("엑셀")}
          />
        }
      />

      <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1">
          <CommonGrid<FactoryData>
            rowData={rowData}
            columnDefs={factoryColumnDefs}
            onCellValueChanged={onCellValueChanged}
            gridOptions={{
              ...gridOptions,
              rowSelection: "multiple",
              suppressRowClickSelection: true,
              stopEditingWhenCellsLoseFocus: true,
            }}
          />
        </div>

        <div className="h-8 border-t bg-slate-50 px-4 flex items-center text-xs text-slate-500">
          Total:{" "}
          <span className="font-bold text-slate-700 ml-1">
            {rowData.length}
          </span>{" "}
          rows
        </div>
      </div>
    </PageShell>
  );
}
