// src/features/mdm/api/factoryApi.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Vite의 프록시 설정에 따라 '/api'로 시작하는 요청은 백엔드 서버로 전달됩니다.
  headers: {
    "user": "user",
    "Accept-Language": "ko-KR",
    "Time-Zone": "Asia/Seoul"
  },
});
export interface RegisterPlantRequest {
  plantId: string;
  plantNameKoKr?: string;
  plantNameEnUs?: string;
  plantNameZhCn?: string;
  plantNameViVn?: string;
  plantNameLoLo?: string;
  description?: string;
  enterpriseId?: string;
  address?: string;
  phone?: string;
  fax?: string;
  language?: string;
  startBusinessHour?: string;
  validState: string;
}

export const factoryApi = {
  // 1. 조회 API
  searchPlants: async (params: { plantId?: string; validState?: string }) => {
    const response = await api.get("/plant/search", { params });
    return response.data;
  },

  // 2. 등록 API
  registerPlant: async (params: RegisterPlantRequest) => {
    const response = await api.post("/plant", params);
    return response.data;
  },

  // 공장 수정 API (PUT)
  updatePlant: async (params: RegisterPlantRequest) => {
    const response = await api.put("/plant", params);
    return response.data;
  },
};