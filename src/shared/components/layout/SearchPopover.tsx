// src/shared/components/layout/SearchPopover.tsx
import { type ReactNode } from "react";
import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchPopoverProps {
  title: string;
  children: ReactNode;
  onSearch: () => void;
  onReset?: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  width?: number;
}

export function SearchPopover({
  title,
  children,
  onSearch,
  onReset,
  isOpen,
  onOpenChange,
  width = 400,
}: SearchPopoverProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-slate-300">
          <Search className="mr-2 h-4 w-4 text-emerald-500" />
          조회 조건
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        style={{ width: `${width}px`, height: "calc(100vh - 240px)" }}
        className="h-full flex flex-col p-0 shadow-2xl border-slate-200 bg-white"
      >
        {/* 헤더 영역 */}
        <div className="p-4 border-b bg-slate-50/50 rounded-t-md shrink-0">
          <h4 className="font-bold text-slate-800">{title}</h4>
        </div>

        {/* 폼 내용 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {children}
        </div>

        {/* 푸터 버튼 영역 */}
        <div className="p-4 border-t bg-slate-50/50 flex gap-2 shrink-0 ">
          <Button
            variant="ghost"
            className="flex-1 bg-white border"
            onClick={onReset}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> 초기화
          </Button>
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={onSearch}
          >
            조회하기
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
