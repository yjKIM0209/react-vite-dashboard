// src/features/layout/components/AppSidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarHeaderLogo } from "@/shared/components/sidebar/SidebarHeaderLogo";
import { SidebarNavList } from "@/shared/components/sidebar/SidebarNavList";
import { SidebarUserStatus } from "@/shared/components/sidebar/SidebarUserStatus";
import {
  LayoutDashboard,
  FlaskConical,
  BarChart3,
  Database,
} from "lucide-react";

const RAW_MENUS = [
  {
    name: "대시보드",
    href: "/",
    icon: LayoutDashboard,
    role: ["admin", "user"],
  },
  {
    name: "기준 정보",
    icon: Database,
    role: ["admin"],
    items: [
      {
        name: "공통",
        items: [{ name: "공장 관리", href: "/factory-master" }],
      },
      {
        name: "설비",
        items: [{ name: "설비 관리", href: "/equipment-master" }],
      },
    ],
  },
  {
    name: "Grid 예시",
    icon: Database,
    role: ["admin"],
    items: [
      { name: "이력 조회 (AG)", href: "/equipment-history" },
      { name: "이력 조회 (TS)", href: "/comparison-history" },
      { name: "무한 스크롤 이력", href: "/history-infinite" },
    ],
  },
  {
    name: "API 테스트",
    href: "/api-test",
    icon: FlaskConical,
    role: ["admin"],
  },
  { name: "생산 리포트", href: "/reports", icon: BarChart3, role: ["admin"] },
];

export function AppSidebar() {
  const userRole = "admin";
  const filteredMenus = RAW_MENUS.filter((menu) =>
    menu.role.includes(userRole),
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-800">
      <SidebarHeader className="bg-slate-900 border-b border-slate-800/50 py-4">
        <SidebarHeaderLogo title="FACTORY OS" />
      </SidebarHeader>

      <SidebarContent className="bg-slate-900 pt-4">
        <SidebarNavList items={filteredMenus} />
      </SidebarContent>

      <SidebarFooter className="bg-slate-900 border-t border-slate-800/50 p-4">
        <SidebarUserStatus
          username="admin_user"
          systemStatus="시스템 정상 운영 중"
        />
      </SidebarFooter>
    </Sidebar>
  );
}
