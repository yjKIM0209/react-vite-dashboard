export interface EquipmentNode {
  id: string;
  name: string;
  type: 'factory' | 'area' | 'equipment'
  children?: EquipmentNode[];
}

// AG-Grid 이력 데이터를 위한 타입
export interface HistoryData {
  no: number;
  factory: string;
  area: string;
  process: string;    
  status: string;     
  eqpId: string;
  eqpName: string;
  startTime: string;
  endTime: string;
  repairCost: number; 
  duration: string;
  memo: string;
}