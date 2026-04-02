// src/pages/mdm/AreaManagementPage.tsx
import { useCallback, useState, useMemo } from "react";
import { PageShell } from "@/shared/components/layout/PageShell";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { ControlBar } from "@/shared/components/layout/ControlBar";
import { ActionBar } from "@/shared/components/layout/ActionBar";
import { useCurrentMenu } from "@/features/layout/hooks/useCurrentMenu";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SearchPopover } from "@/shared/components/layout/SearchPopover";
import CommonGrid from "@/shared/components/table/AgGrid";
import { GridHeader } from "@/shared/components/layout/GridHeader";

// Area 전용 API 및 타입/컬럼 정의가 완료되면 교체.
// import { areaApi } from "@/features/mdm/api/areaApi";
// import { areaColumnDefs, type AreaData } from "@/features/mdm/types/area";

// 임시 타입 정의 (추후 삭제)
interface AreaData {
  areaId: string;
  areaName: string;
  description?: string;
  validState: string;
  created_time?: string;
  [key: string]: any;
}

export default function AreaManagementPage() {
  const { title, breadcrumbs } = useCurrentMenu();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [gridSearch, setGridSearch] = useState("");
  const [rowData, setRowData] = useState<AreaData[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);

  const [searchParams, setSearchParams] = useState({
    areaId: "",
    validState: "Valid",
  });

  // 조회 로직 (API 연동 전 임시 로그)
  const handleSearch = useCallback(async () => {
    console.log("Area 조회 요청:", searchParams);
    // const data = await areaApi.searchAreas(searchParams);
    // setRowData(data);
    setIsPopoverOpen(false);
  }, [searchParams]);

  // 신규 행 추가
  const handleAddRow = useCallback(() => {
    const newRow: AreaData = {
      areaId: "", 
      areaName: "",
      validState: "Valid",
      created_time: "", // 신규 행 구분자
    };
    setRowData((prev) => [newRow, ...prev]);
  }, []);

  // 그리드 Ready
  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  // 행 삭제 (로컬 상태 우선 삭제)
  const handleDeleteRow = useCallback(() => {
    if (!gridApi) return;
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) return alert("삭제할 행을 선택해주세요.");
    
    setRowData((prev) => prev.filter((row) => !selectedRows.includes(row)));
  }, [gridApi]);

  // 저장 로직 (API 연동 전 구조만 유지)
  const handleSave = useCallback(async () => {
    alert("저장 로직은 API 개발 후 연결 예정입니다.");
  }, []);

  const gridOptions = useMemo(
    () => ({
      quickFilterText: gridSearch,
      getRowClass: (params: any) => {
        if (params.data && !params.data.created_time) {
          return "row-new"; // 신규 행 스타일
        }
        return undefined;
      },
    }),
    [gridSearch]
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
          <SearchPopover
            isOpen={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
            title={`${title} 조회 조건`}
            onSearch={handleSearch}
            width={320}
          >
            {/* Area 전용 필터 폼 제작 후 교체 */}
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">Area ID</label>
                <Input 
                  value={searchParams.areaId} 
                  onChange={(e) => setSearchParams(prev => ({...prev, areaId: e.target.value}))}
                />
              </div>
            </div>
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
          <CommonGrid<AreaData>
            rowData={rowData}
            columnDefs={[]} // areaColumnDefs 연결
            onGridReady={onGridReady}
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