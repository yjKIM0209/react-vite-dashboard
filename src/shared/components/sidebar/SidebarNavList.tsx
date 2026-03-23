// src/shared/components/sidebar/SidebarNavList.tsx
import { Link, useLocation } from "react-router-dom";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { type LucideIcon } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export function SidebarNavList({ items, label }: { items: NavItem[]; label?: string }) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel className="text-slate-500">{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.name}
                className={`h-11 ${isActive ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-400 hover:bg-slate-800"}`}
              >
                <Link to={item.href}>
                  <item.icon className={isActive ? "text-white" : "text-slate-400"} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}