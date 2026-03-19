import api from './index';
import type { EquipmentApi } from '@/types/equipment';

export const searchEquipment = async () => {

  const response = await api.get<EquipmentApi[]>('/equipment/search', {
    data: {}, 
  });
  return response.data;
};