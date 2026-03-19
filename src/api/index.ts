import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'accept': '*/*',
    'Accept-Language': 'ko-KR',
    'Time-Zone': 'Asia/Seoul',
  },
});

export default api;