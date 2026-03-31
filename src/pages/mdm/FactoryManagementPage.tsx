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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
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
      setIsSheetOpen(false);
    } catch (error) {
      console.error("조회 중 오류 발생:", error);
      alert("조회에 실패했습니다. 서버 상태를 확인하세요.");
    }
  }, [searchParams]);

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
            onAdd={() => console.log("추가")}
            onDelete={() => console.log("삭제")}
            onSave={() => console.log("저장")}
            onExcel={() => console.log("엑셀")}
          />
        }
      />

      <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1">
          <CommonGrid<FactoryData>
            rowData={rowData}
            columnDefs={factoryColumnDefs}
            gridOptions={{
              ...gridOptions,
              rowSelection: "multiple",
              suppressRowClickSelection: true,
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
