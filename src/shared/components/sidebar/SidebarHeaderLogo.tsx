// src/shared/components/sidebar/SidebarHeaderLogo.tsx
import { CircleDot } from "lucide-react";

export function SidebarHeaderLogo({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg">
        <CircleDot size={20} />
      </div>
      <span className="text-xl font-black tracking-tighter text-blue-400 group-data-[collapsible=icon]:hidden">
        {title}
      </span>
    </div>
  );
}