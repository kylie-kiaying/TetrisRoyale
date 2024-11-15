import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

const createApiClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );
  
  return client;
};

export const apiClients = {
  auth: createApiClient(API_ENDPOINTS.auth),
  player: createApiClient(API_ENDPOINTS.player),
  tournament: createApiClient(API_ENDPOINTS.tournament),
  matchmaking: createApiClient(API_ENDPOINTS.matchmaking),
  rating: createApiClient(API_ENDPOINTS.rating),
  admin: createApiClient(API_ENDPOINTS.admin),
  analytics: createApiClient(API_ENDPOINTS.analytics),
};