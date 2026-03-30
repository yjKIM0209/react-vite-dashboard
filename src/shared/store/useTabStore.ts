import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 예시로 '/factory-master', '공장 관리'
interface Tab {
  id: string;    
  title: string; 
}

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Tab) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  clearTabs: () => void;
}

export const useTabStore = create<TabState>()(
  persist(
    (set) => ({
      tabs: [],
      activeTabId: null,

      addTab: (tab) => set((state) => {
        const isExists = state.tabs.find((t) => t.id === tab.id);
        if (isExists) return { activeTabId: tab.id };
        return {
          tabs: [...state.tabs, tab],
          activeTabId: tab.id,
        };
      }),

      removeTab: (tabId) => set((state) => {
        const newTabs = state.tabs.filter((t) => t.id !== tabId);
        let newActiveId = state.activeTabId;

        if (state.activeTabId === tabId) {
          const currentIndex = state.tabs.findIndex(t => t.id === tabId);
          newActiveId = newTabs[currentIndex - 1]?.id || newTabs[0]?.id || null;
        }

        return {
          tabs: newTabs,
          activeTabId: newActiveId,
        };
      }),

      setActiveTab: (tabId) => set({ activeTabId: tabId }),

      clearTabs: () => set({ tabs: [], activeTabId: null }),
    }),
    {
      name: 'ees-tab-storage', // localStorage에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // 저장소 종류
    }
  )
);