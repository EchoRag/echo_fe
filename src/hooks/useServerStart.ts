import { useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import useAxios from './useAxios';
import { API_PATHS } from '../utils/apiPaths';

export const useServerStart = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const axios = useAxios();

  const startServer = useCallback(async () => {
    if (!executeRecaptcha) {
      throw new Error('ReCAPTCHA not initialized');
    }

    try {
      // Execute reCAPTCHA and get token
      const token = await executeRecaptcha('start-server');
      
      // Send token to backend for assessment
      const response = await axios.post(API_PATHS.PROXY_SERVER.START, null, {
        headers: {
          'x-recaptcha-token': token
        }
      });

      return response.data;
    } catch (error) {
      console.error('Server start failed:', error);
      throw error;
    }
  }, [executeRecaptcha, axios]);

  return { startServer };
}; 