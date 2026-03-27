// src/features/layout/hooks/useCurrentMenu.ts
import { useLocation } from "react-router-dom";
import { RAW_MENUS } from "../constants/menu";
import { type NavItem, type NavSubItem } from "../types/menu";

export function useCurrentMenu() {
  const { pathname } = useLocation();

  // 재귀적으로 메뉴 트리 탐색
  const findMenuPath = (
    items: (NavItem | NavSubItem)[],
    currentPath: string,
    parents: string[] = []
  ): { title: string; breadcrumbs: string[] } | null => {
    for (const item of items) {
      const newParents = [...parents, item.name];

      // 현재 경로와 일치하는 메뉴를 찾은 경우
      if ("href" in item && item.href === currentPath) {
        return { title: item.name, breadcrumbs: newParents };
      }

      // 하위 아이템이 있는 경우 재귀 탐색
      if (item.items) {
        const result = findMenuPath(item.items, currentPath, newParents);
        if (result) return result;
      }
    }
    return null;
  };

  const menuInfo = findMenuPath(RAW_MENUS, pathname);

  return {
    title: menuInfo?.title ?? "Unknown Page",
    breadcrumbs: menuInfo?.breadcrumbs ?? [],
  };
}