// src/shared/components/sidebar/SidebarNavList.tsx
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

export interface NavSubItem {
  name: string;
  href: string;
}

export interface NavItem {
  name: string;
  icon: LucideIcon;
  href?: string; // 단독 메뉴일 때
  items?: NavSubItem[]; // 하위 메뉴가 있을 때 (트리 구조)
}

export function SidebarNavList({ items }: { items: NavItem[] }) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          // 하위 메뉴가 있는 경우 (트리/Collapsible)
          if (item.items) {
            const isSubActive = item.items.some((sub) =>
              pathname.startsWith(sub.href),
            );
            return (
              <Collapsible
                key={item.name}
                asChild
                defaultOpen={isSubActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.name}
                      isActive={isSubActive}
                      className="h-11 px-4 text-[15px] font-semibold"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                      {/* 오른쪽 화살표 */}
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub className="border-l border-white/10 ml-5 pl-3 space-y-0.5">
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === subItem.href}
                            className={`text-sm h-9 ${pathname === subItem.href ? "text-white" : "text-sidebar-foreground"}`}
                          >
                            <Link to={subItem.href}>
                              <span>{subItem.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // 단독 메뉴인 경우
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href ?? "#"));
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.name}
                className={`h-11 px-4 text-[15px] font-semibold transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                  isActive
                    ? "bg-sidebar-accent text-white"
                    : "text-sidebar-foreground"
                }`}
              >
                <Link to={item.href ?? "#"}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
