// src/shared/components/sidebar/SidebarHeaderLogo.tsx
import { CircleDot } from "lucide-react";

export function SidebarHeaderLogo({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3 border-b border-white/10">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/90 text-white shadow-lg">
        <CircleDot size={22} className="stroke-[1.5]" />
      </div>
      <span className="text-2xl font-black tracking-tight text-white group-data-[collapsible=icon]:hidden">
        {title}
      </span>
    </div>
  );
}