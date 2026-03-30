// src/shared/components/layout/BottomTabBar.tsx
import { useTabStore } from "@/shared/store/useTabStore";
import { useNavigate } from "react-router-dom"; 
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomTabBar() {
  const { tabs, activeTabId, setActiveTab, removeTab } = useTabStore();
  const navigate = useNavigate();

  if (tabs.length === 0) return null;

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    navigate(tabId);
  };

  const handleRemoveTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation(); 
    removeTab(tabId);
  };

  return (
    <div className="h-10 bg-slate-900 border-t border-slate-700 flex items-center px-2 gap-1 overflow-x-auto shrink-0 z-50">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => handleTabClick(tab.id)} 
          className={cn(
            "group flex items-center h-8 px-3 gap-2 rounded-t-sm cursor-pointer transition-all text-xs font-medium border-x border-t",
            activeTabId === tab.id 
              ? "bg-white text-slate-900 border-slate-200 shadow-sm" 
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 border-slate-700"
          )}
        >
          <span className="max-w-120px truncate">{tab.title}</span>
          <X
            className="w-3 h-3 hover:text-red-500 transition-colors shrink-0"
            onClick={(e) => handleRemoveTab(e, tab.id)} 
          />
        </div>
      ))}
    </div>
  );
}