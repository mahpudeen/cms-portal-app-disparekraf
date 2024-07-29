import axios from 'axios';
import { toast }  from 'vue3-toastify';
import { useAuthStore } from '@/stores/auth';
import 'vue3-toastify/dist/index.css';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`, // Your API base URL
  timeout: 10000,  // Timeout duration in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Interceptors for request and response handling
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify config here, such as adding headers or tokens
    const { token, logout } = useAuthStore();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['X-Channel'] = token;
    } else (
      logout()
    )
    return config;
  },
  (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle response data
    return response;
  },
  (error) => {
    // Handle error responses
    const errorMessage = error.response?.data?.error || 'Oops! Something went wrong.';
    toast.error(errorMessage, {
        "theme": "colored",
    }); // Display toast with error message
    const { logout } = useAuthStore();
    if (error.response?.status == 401) {
      logout()
    }
    console.log(error.response?.status)
    return Promise.reject(error);
});

export default axiosInstance;
