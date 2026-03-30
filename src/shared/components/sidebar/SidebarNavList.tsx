// src/shared/components/sidebar/SidebarNavList.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
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
import type { NavItem, NavSubItem } from "@/features/layout/types/menu";
import { useTabStore } from "@/shared/store/useTabStore";

export function SidebarNavList({ items }: { items: NavItem[] }) {
  const { pathname } = useLocation();
  const { addTab } = useTabStore();
  const navigate = useNavigate();

  const handleMenuClick = (name: string, href?: string) => {
    if (href && href !== "#") {
      addTab({ id: href, title: name });
      navigate(href);
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          // 1. 하위 메뉴가 있는 경우
          if (item.items) {
            const isSubActive = item.items.some((sub) =>
              sub.href ? pathname.startsWith(sub.href) : false
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
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span>{item.name}</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub className="border-l border-white/10 ml-5 pl-3 space-y-0.5">
                      {item.items.map((subItem) => (
                        <SidebarSubMenu
                          key={subItem.name}
                          subItem={subItem}
                          pathname={pathname}
                          onMenuClick={handleMenuClick}
                        />
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // 2. 단독 메뉴인 경우
          const isActive = item.href
            ? pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            : false;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                isActive={isActive}
                tooltip={item.name}
                onClick={() => handleMenuClick(item.name, item.href)}
                className={`h-11 px-4 text-[15px] font-semibold transition-all hover:bg-sidebar-accent ${
                  isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground"
                }`}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function SidebarSubMenu({
  subItem,
  pathname,
  onMenuClick,
}: {
  subItem: NavSubItem;
  pathname: string;
  onMenuClick: (name: string, href?: string) => void;
}) {
  // 하위 아이템(3단계)이 있는 경우
  if (subItem.items) {
    const isDeepActive = subItem.items.some((deep) =>
      deep.href ? pathname.startsWith(deep.href) : false
    );

    return (
      <Collapsible defaultOpen={isDeepActive} className="group/sub-collapsible">
        <SidebarMenuSubItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton className="text-sm h-9">
              <span>{subItem.name}</span>
              <ChevronRight className="ml-auto h-3 w-3 transition-transform duration-200 group-data-[state=open]/sub-collapsible:rotate-90" />
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub className="ml-2 border-l border-white/5">
              {subItem.items.map((deepItem) => (
                <SidebarMenuSubItem key={deepItem.name}>
                  <SidebarMenuSubButton
                    isActive={pathname === deepItem.href}
                    onClick={() => onMenuClick(deepItem.name, deepItem.href)}
                    className="text-xs h-8"
                  >
                    <span>{deepItem.name}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuSubItem>
      </Collapsible>
    );
  }

  // 일반 서브 메뉴 (최하단 노드)
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        isActive={pathname === subItem.href}
        onClick={() => onMenuClick(subItem.name, subItem.href)}
        className={`text-sm h-9 ${
          pathname === subItem.href ? "text-white" : "text-sidebar-foreground"
        }`}
      >
        <span>{subItem.name}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}