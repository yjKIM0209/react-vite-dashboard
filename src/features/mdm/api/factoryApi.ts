// src/features/mdm/api/factoryApi.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Vite의 프록시 설정에 따라 '/api'로 시작하는 요청은 백엔드 서버로 전달됩니다.
  headers: {
    "user": "admin",
    "Accept-Language": "ko-KR",
    "Time-Zone": "Asia/Seoul"
  },
});

export const factoryApi = {
  searchPlants: async (params: { plantId?: string; validState?: string }) => {
    const response = await api.get("/plant/search", { params });
    return response.data;
  },
};