// src/features/layout/constants/menu.ts
import {
  LayoutDashboard,
  FlaskConical,
  BarChart3,
  Database,
} from "lucide-react";
import type { NavItem } from "../types/menu";

export const RAW_MENUS: NavItem[] = [
  {
    name: "대시보드",
    href: "/",
    icon: LayoutDashboard,
    role: ["admin", "user"],
  },
  { name: "기준정보 예시", href: "/sample-master", icon: Database, role: ["admin"] },
  {
    name: "기준 정보",
    icon: Database,
    role: ["admin"],
    items: [
      {
        name: "공통",
        items: [
          { name: "공장 관리", href: "/factory-master" },
          { name: "Area 관리", href: "/area-master" },
        ],
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
