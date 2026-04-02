// 기준정보 UI 셈플 화면 입니다.
// 수정하지 마세요.
// src/pages/mdm/SampleManagementPage.tsx
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
import { type ColDef } from "ag-grid-community"; // 타입 추가

interface SampleData {
  id: string; // 범용적인 필드명
  name: string;
  description?: string;
  validState: string;
  created_time?: string;
  [key: string]: any;
}

export default function SampleManagementPage() {
  const { title, breadcrumbs } = useCurrentMenu();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [gridSearch, setGridSearch] = useState("");
  const [rowData, setRowData] = useState<SampleData[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);

  // 2. 범용적인 검색 파라미터명 사용
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    validState: "Valid",
  });

  // 임시 컬럼 정의 (복붙 후 해당 도메인에 맞게 수정)
  const sampleColumnDefs: ColDef<SampleData>[] = [
    {
      field: "id",
      headerName: "ID",
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { field: "name", headerName: "명칭", editable: true },
    { field: "description", headerName: "비고", editable: true },
    { field: "validState", headerName: "상태" },
  ];

  const handleSearch = useCallback(async () => {
    console.log("조회 요청:", searchParams);
    setIsPopoverOpen(false);
  }, [searchParams]);

  const handleAddRow = useCallback(() => {
    const newRow: SampleData = {
      id: "",
      name: "",
      validState: "Valid",
      created_time: "",
    };
    setRowData((prev) => [newRow, ...prev]);
  }, []);

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  const handleDeleteRow = useCallback(() => {
    if (!gridApi) return;
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) return alert("삭제할 행을 선택해주세요.");

    setRowData((prev) => prev.filter((row) => !selectedRows.includes(row)));
  }, [gridApi]);

  const handleSave = useCallback(async () => {
    alert("저장 로직은 API 개발 후 연결 예정입니다.");
  }, []);

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
          <SearchPopover
            isOpen={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
            title={`${title} 조회 조건`}
            onSearch={handleSearch}
            width={320}
          >
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">검색어</label>
                <Input
                  value={searchParams.keyword}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      keyword: e.target.value,
                    }))
                  }
                  placeholder="ID 또는 명칭 입력"
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
            onExcel={() => console.log("엑셀 다운로드")}
          />
        }
      />

      <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <GridHeader title={title} count={rowData.length} />
        <div className="flex-1">
          <CommonGrid<SampleData>
            rowData={rowData}
            columnDefs={sampleColumnDefs} // 3. 정의한 샘플 컬럼 연결
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
