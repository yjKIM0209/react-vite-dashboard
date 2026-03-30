import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FactoryFilterForm() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="grid gap-2 w-full">
        <Label
          htmlFor="factory-search"
          className="text-xs font-semibold text-slate-600"
        >
          공장 코드 / 명
        </Label>
        <Input
          id="factory-search"
          placeholder="검색어를 입력하세요"
          className="h-9 w-full bg-white"
        />
      </div>

      <div className="grid gap-2 w-full">
        <Label
          htmlFor="factory-type"
          className="text-xs font-semibold text-slate-600"
        >
          공장 유형
        </Label>
        <Select>
          <SelectTrigger id="factory-type" className="h-9 w-full bg-white">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={4}
            className="z-9999 min-w-var(--radix-select-trigger-width) bg-white border border-slate-200 shadow-md rounded-md"
          >
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="prod">생산 공장</SelectItem>
            <SelectItem value="ware">물류 창고</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2 w-full">
        <Label
          htmlFor="use-yn"
          className="text-xs font-semibold text-slate-600"
        >
          유효 상태
        </Label>
        <Select defaultValue="y">
          <SelectTrigger id="use-yn" className="h-9 w-full bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={4}
            className="z-9999 min-w-var(--radix-select-trigger-width) bg-white border border-slate-200 shadow-md rounded-md"
          >
            <SelectItem value="y">사용 (Y)</SelectItem>
            <SelectItem value="n">미사용 (N)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
