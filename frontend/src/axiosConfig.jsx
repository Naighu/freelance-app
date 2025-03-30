import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5001',
  baseURL: 'http://13.54.187.158:5001',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
