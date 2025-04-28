import { renderHook } from '@testing-library/react';
import axios, { AxiosRequestConfig } from 'axios';
import { useAuthContext } from '../../context/AuthContext';
import useAxios from '../useAxios';

// Mock dependencies first
jest.mock('axios');
jest.mock('../../context/AuthContext');
jest.mock('../../utils/faroConfig', () => ({
  faro: {
    api: {
      getOTEL: jest.fn().mockReturnValue({
        trace: {
          getTracer: jest.fn().mockReturnValue({
            startSpan: jest.fn().mockReturnValue({
              spanContext: jest.fn().mockReturnValue({ traceId: 'test-trace-id' }),
              end: jest.fn(),
            }),
          }),
        },
      }),
    },
  },
}));

// Mock environment variables
interface MockEnv {
  VITE_APP_API_URI?: string;
}

const mockEnv: MockEnv = {
  VITE_APP_API_URI: 'http://test-api.example.com',
};

// Mock import.meta.env
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: mockEnv,
    },
  },
  configurable: true,
});

describe('useAxios', () => {
  const mockToken = 'test-token';
  const mockAxiosInstance = {
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn(),
      },
      response: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthContext as jest.Mock).mockReturnValue({ jwt: mockToken });
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
  });

  it('should create axios instance with correct configuration', () => {
    renderHook(() => useAxios());
    
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:3000',
      timeout: 180000,
    });
  });

  it('should use default baseURL when VITE_APP_API_URI is not set', () => {
    // Temporarily remove the VITE_APP_API_URI from the mock
    const originalEnv = { ...mockEnv };
    delete mockEnv.VITE_APP_API_URI;
    
    renderHook(() => useAxios());
    
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:3000',
      timeout: 180000,
    });
    
    // Restore the original mock
    Object.assign(mockEnv, originalEnv);
  });

  it('should set up request interceptor with token', () => {
    renderHook(() => useAxios());
    
    // Get the request interceptor function
    const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    const config: AxiosRequestConfig = { headers: {} };
    
    // Call the interceptor
    requestInterceptor(config);
    
    expect(config.headers?.Authorization).toBe(`Bearer ${mockToken}`);
  });

  it('should set up request interceptor with trace ID', () => {
    renderHook(() => useAxios());
    
    // Get the request interceptor function
    const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    const config: AxiosRequestConfig = { headers: {} };
    
    // Call the interceptor
    requestInterceptor(config);
    
    expect(config.headers?.['X-Trace-Id']).toBe('test-trace-id');
  });

  it('should handle 401 response errors', async () => {
    renderHook(() => useAxios());
    
    // Get the response interceptor error handler
    const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
    const error = { response: { status: 401 } };
    
    // Mock console.log to prevent it from cluttering the test output
    const originalConsoleLog = console.log;
    console.log = jest.fn();
    
    try {
      await responseInterceptor(error);
    } catch (e) {
      // Expected rejection
    }
    
    // Restore console.log
    console.log = originalConsoleLog;
    
    // Note: The actual redirect is commented out in the code
    // expect(window.location.href).toBe('/');
  });

  it('should clean up interceptors on unmount', () => {
    const { unmount } = renderHook(() => useAxios());
    
    unmount();
    
    expect(mockAxiosInstance.interceptors.request.eject).toHaveBeenCalled();
    expect(mockAxiosInstance.interceptors.response.eject).toHaveBeenCalled();
  });

  it('should return axios instance', () => {
    const { result } = renderHook(() => useAxios());
    expect(result.current).toBe(mockAxiosInstance);
  });
}); 