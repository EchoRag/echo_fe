import axios from 'axios';
import { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { faro } from '../utils/faroConfig';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URI,
  timeout: 180000,
});

const useAxiosInterceptor = (token: string | null) => {
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add Faro trace ID to headers
        const otel = faro.api.getOTEL();
        if (otel) {
          const span = otel.trace.getTracer('http-request').startSpan('http-request');
          if (span) {
            config.headers['X-Trace-Id'] = span.spanContext().traceId;
            span.end();
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log('Received 401 error, redirecting to root');
          // Handle unauthorized errors
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptors when component unmounts
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);
};

export default function useAxios() {
  const { token } = useAuthContext();
  useAxiosInterceptor(token);
  return axiosInstance;
}

