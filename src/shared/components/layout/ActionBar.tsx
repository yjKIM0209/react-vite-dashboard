// src/shared/components/layout/ActionBar.tsx
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save, Search, FileDown } from "lucide-react";

interface ActionBarProps {
  onSearch?: () => void;
  onAdd?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onExcel?: () => void;
}

export function ActionBar({ onSearch, onAdd, onDelete, onSave, onExcel }: ActionBarProps) {
  return (
    <div className="flex items-center gap-1.5">
      {onSearch && (
        <Button size="sm" variant="outline" onClick={onSearch} className="h-9">
          <Search className="w-4 h-4 mr-1.5" /> 조회
        </Button>
      )}
      {onAdd && (
        <Button size="sm" variant="outline" onClick={onAdd} className="h-9 border-blue-200 text-blue-600 hover:bg-blue-50">
          <Plus className="w-4 h-4 mr-1.5" /> 추가
        </Button>
      )}
      {onDelete && (
        <Button size="sm" variant="outline" onClick={onDelete} className="h-9 border-red-200 text-red-600 hover:bg-red-50">
          <Trash2 className="w-4 h-4 mr-1.5" /> 삭제
        </Button>
      )}
      {onSave && (
        <Button size="sm" onClick={onSave} className="h-9 bg-emerald-600 hover:bg-emerald-700">
          <Save className="w-4 h-4 mr-1.5" /> 저장
        </Button>
      )}
      {onExcel && (
        <Button size="sm" variant="ghost" onClick={onExcel} className="h-9 text-slate-500 border-emerald-600">
          <FileDown className="w-4 h-4 mr-1.5" /> 엑셀
        </Button>
      )}
    </div>
  );
}