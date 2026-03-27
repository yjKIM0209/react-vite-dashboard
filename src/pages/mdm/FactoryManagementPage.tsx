import { useState } from "react";
import { PageShell } from "@/shared/components/layout/PageShell";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { ControlBar } from "@/shared/components/layout/ControlBar"; 
import { ActionBar } from "@/shared/components/layout/ActionBar";
import { SideSearchSheet } from "@/shared/components/layout/SideSearchSheet";
import { useCurrentMenu } from "@/features/layout/hooks/useCurrentMenu";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function FactoryManagementPage() {
  const { title, breadcrumbs } = useCurrentMenu();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [gridSearch, setGridSearch] = useState("");

  return (
    <PageShell>
      {/* 1층: 헤더 (검색창 포함) */}
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

      {/* 2층: 컨트롤 바 (조회조건 + 액션버튼) */}
      <ControlBar
        left={
          <SideSearchSheet
            isOpen={isSearchOpen}
            onOpenChange={setIsSearchOpen}
            title={`${title} 조회 조건`}
            onSearch={() => setIsSearchOpen(false)}
          >
            <div className="space-y-4">
              {/* 공장 전용 필드들 */}
              <p className="text-sm text-slate-500">조회 조건을 입력하세요.</p>
            </div>
          </SideSearchSheet>
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

      {/* 3층: 메인 그리드 영역 */}
      <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 flex items-center justify-center text-slate-400 font-medium">
          AG-Grid 로딩 영역
        </div>
        
        {/* 하단 상태바 (필요시 추가) */}
        <div className="h-8 border-t bg-slate-50 px-4 flex items-center text-xs text-slate-500">
          Total: 0 rows
        </div>
      </div>
    </PageShell>
  );
}