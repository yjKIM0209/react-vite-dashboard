// src/shared/components/sidebar/SidebarUserStatus.tsx
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SidebarUserStatus({ username, systemStatus }: { username: string; systemStatus: string }) {
  return (
    <div className="relative flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center transition-all">
      <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operator</p>
        <p className="text-sm font-semibold text-slate-200 mt-0.5 truncate">{username}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          <span className="text-[11px] font-medium text-green-500/90">{systemStatus}</span>
        </div>
      </div>

      <div className="shrink-0">
        <SidebarTrigger className="h-8 w-8 text-slate-400 hover:bg-slate-700/50 hover:text-white border-none shadow-none" />
      </div>
    </div>
  );
}