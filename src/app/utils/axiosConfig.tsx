import axios from 'axios';
import { BASE_URL } from './config';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

// Set default headers
axiosInstance.defaults.headers.common['Content-Type'] = 'multipart/form-data';


// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Axios Response=',response)
    return response;
  },
  (error) => {
    console.log('Axios error=',error)
    return Promise.reject(error);
  }
);

export default axiosInstance;
