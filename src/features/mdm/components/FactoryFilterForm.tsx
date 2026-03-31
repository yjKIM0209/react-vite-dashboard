import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FactoryFilterFormProps {
  values: {
    plantId: string;
    validState: string;
  };
  onChange: (newValues: { plantId?: string; validState?: string }) => void;
}

export function FactoryFilterForm({ values, onChange }: FactoryFilterFormProps) {
  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="grid gap-2 w-full">
        <Label
          htmlFor="plantId"
          className="text-xs font-semibold text-slate-600"
        >
          공장 코드 / 명
        </Label>
        <Input
          id="plantId"
          placeholder="검색어를 입력하세요"
          className="h-9 w-full bg-white"
          value={values.plantId}
          onChange={(e) => onChange({ plantId: e.target.value })}
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
          htmlFor="validState"
          className="text-xs font-semibold text-slate-600"
        >
          유효 상태
        </Label>
        <Select 
          value={values.validState} 
          onValueChange={(val) => onChange({ validState: val })}
        >
          <SelectTrigger id="validState" className="h-9 w-full bg-white">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={4}
            className="z-9999 min-w-var(--radix-select-trigger-width) bg-white border border-slate-200 shadow-md rounded-md"
          >
            <SelectItem value="Valid">유효 (Valid)</SelectItem>
            <SelectItem value="Invalid">유효하지 않음 (Invalid)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}