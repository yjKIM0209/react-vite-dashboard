// src/shared/components/layout/LoadingOverlay.tsx
import { Loader2 } from "lucide-react";

export function LoadingOverlay({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-slate-600">처리 중...</p>
      </div>
    </div>
  );
}