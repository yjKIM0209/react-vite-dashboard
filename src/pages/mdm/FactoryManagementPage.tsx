// src/pages/mdm/FactoryManagementPage.tsx
import { useState, useMemo } from "react";
import { PageShell } from "@/shared/components/layout/PageShell";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { ControlBar } from "@/shared/components/layout/ControlBar";
import { ActionBar } from "@/shared/components/layout/ActionBar";
import { SideSearchSheet } from "@/shared/components/layout/SideSearchSheet";
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
import { MOCK_FACTORIES } from "@/features/mdm/api/factoryMock";

export default function FactoryManagementPage() {
  const { title, breadcrumbs } = useCurrentMenu();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [gridSearch, setGridSearch] = useState("");
  const [rowData] = useState<FactoryData[]>(MOCK_FACTORIES);

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
              onSearch={() => setIsPopoverOpen(false)}
              width={320}
            >
              <div className="space-y-4">
                <FactoryFilterForm />
              </div>
            </SearchPopover>
            <SideSearchSheet
              isOpen={isSheetOpen}
              onOpenChange={setIsSheetOpen}
              title={`${title} 조회 조건`}
              onSearch={() => setIsSheetOpen(false)}
              width={400}
            >
              <div className="space-y-4">
                <FactoryFilterForm />
              </div>
            </SideSearchSheet>
          </div>
        }
        right={
          <ActionBar
            onSearch={() => console.log("조회")}
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
            showSelection={true}
            gridOptions={gridOptions}
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
