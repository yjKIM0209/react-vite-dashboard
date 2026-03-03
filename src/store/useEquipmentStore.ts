import { create } from 'zustand';

interface EquipmentState {
  selectedEqpId: string | null;
  searchText: string;
  setSelectedEqpId: (id: string | null) => void;
  setSearchText: (text: string) => void;
  reset: () => void;
}

export const useEquipmentStore = create<EquipmentState>((set) => ({
  selectedEqpId: null,
  searchText: '',
  setSelectedEqpId: (id) => set({ selectedEqpId: id }),
  setSearchText: (text) => set({ searchText: text }),
  reset: () => set({ selectedEqpId: null, searchText: '' }),
}));