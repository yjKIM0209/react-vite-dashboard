// src/features/mdm/api/factoryMock.ts
import type { FactoryData } from "../types/factory";

export const MOCK_FACTORIES: FactoryData[] = [
  {
    factoryId: "FAC-001",
    factoryName: "인천 본사 공장",
    division: "전자사업부",
    useYn: "Y",
    description: "주력 생산 라인 (A동)",
    updatedAt: "2026-03-30 14:00:00",
    updatedBy: "김용준",
  },
  {
    factoryId: "FAC-002",
    factoryName: "구미 제2공장",
    division: "전자사업부",
    useYn: "Y",
    description: "수출 전용 라인 (B동)",
    updatedAt: "2026-03-29 09:30:00",
    updatedBy: "관리자",
  },
  {
    factoryId: "FAC-003",
    factoryName: "부산 정비 센터",
    division: "CS사업부",
    useYn: "N",
    description: "공사로 인한 일시 가동 중단",
    updatedAt: "2026-03-25 18:10:00",
    updatedBy: "김용준",
  },
  {
    factoryId: "FAC-004",
    factoryName: "광주 물류 센터",
    division: "물류사업부",
    useYn: "Y",
    description: "호남권 거점 센터",
    updatedAt: "2026-03-20 11:00:00",
    updatedBy: "관리자",
  },
];