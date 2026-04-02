import { List } from "lucide-react";

interface GridHeaderProps {
  title: string;
  count: number;
}

export function GridHeader({ title, count }: GridHeaderProps) {
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-slate-50/50 border-b border-slate-200">
      <div className="font-bold">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
          {title ? `${title} 리스트` : "데이터 리스트"}
        </h3>
      </div>
      
      <div className="flex items-center gap-2">
        <List className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-bold text-slate-600">
          조회 결과 <span className="text-blue-600 ml-1">{count}</span>건
        </h3>
      </div>
    </div>
  );
}
