// src/shared/components/layout/PageShell.tsx
import { type ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

// 모든 CRUD 화면의 일관된 여백과 스크롤 영역을 잡아줍니다.
export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex flex-col h-full p-6 space-y-4 overflow-hidden bg-slate-50/50">
      {children}
    </div>
  );
}