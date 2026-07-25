import axios from 'axios';

const API_BASE_URL = 'https://api.openweathermap.org';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    Accept: 'application/json',
  },
});
