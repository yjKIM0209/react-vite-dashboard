// 설비의 상태를 나타내는 유니온 타입
export type EquipmentStatus = 'Running' | 'Idle' | 'Error' | 'Maintenance';

// 설비 상세 정보를 담는 인터페이스
export interface Equipment {
  id: string;                // 설비 고유 번호
  name: string;              // 설비명
  type: string;              // 설비 종류
  status: EquipmentStatus;   // 현재 상태
  temperature: number;       // 실시간 온도
  humidity: number;          // 실시간 습도
  powerUsage: number;        // 현재 전력 소모량 
  lastMaintenance: string;   // 마지막 점검일
  operationalHours: number;  // 누적 가동 시간
}