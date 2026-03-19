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


export interface EquipmentApi {
  id: string;                    // 고유 UUID
  equipmentId: string;           // 설비 관리 번호 (예: EQP-001)
  name: string;                  // 설비명 (예: 식각기)
  operationStartedAtUtc: string; // 가동 시작 일시 (UTC string)
  createdAtUtc: string;          // 생성 일시 (UTC string)
  updatedAtUtc: string;          // 수정 일시 (UTC string)
  clientTimezone: string;        // 클라이언트 타임존 (예: Asia/Seoul)
}