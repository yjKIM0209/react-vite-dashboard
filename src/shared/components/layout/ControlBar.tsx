// src/shared/components/layout/ControlBar.tsx
import { type ReactNode } from "react";

interface ControlBarProps {
  left?: ReactNode; 
  right?: ReactNode;
}

export function ControlBar({ left, right }: ControlBarProps) {
  return (
    <div className="flex justify-between items-center bg-white p-3 px-4 rounded-lg shadow-sm border border-slate-200">
      {/* 왼쪽 영역: 조회 조건 등의 필터 버튼 */}
      <div className="flex items-center gap-2">
        {left}
      </div>

      {/* 오른쪽 영역: 추가, 삭제, 저장 등의 액션 버튼 그룹 */}
      <div className="flex items-center gap-2">
        {right}
      </div>
    </div>
  );
}