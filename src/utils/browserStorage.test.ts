import { browserStorage } from './browserStorage';

describe('BrowserStorage', () => {
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    // Clear mock localStorage before each test
    mockLocalStorage = {};
    
    // Mock localStorage methods
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {};
        }),
      },
      writable: true,
    });
  });

  describe('setItem and getItem', () => {
    it('should set and get an item correctly', () => {
      const testData = { test: 'data' };
      browserStorage.setItem('testKey', testData);
      const result = browserStorage.getItem('testKey');
      expect(result).toEqual(testData);
    });

    it('should return default value when item does not exist', () => {
      const defaultValue = { default: 'value' };
      const result = browserStorage.getItem('nonExistentKey', defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('should handle JSON parsing errors gracefully', () => {
      mockLocalStorage['invalidJson'] = 'invalid-json';
      const result = browserStorage.getItem('invalidJson');
      expect(result).toBeNull();
    });
  });

  describe('removeItem and clear', () => {
    it('should remove a specific item', () => {
      browserStorage.setItem('testKey', 'testValue');
      browserStorage.removeItem('testKey');
      expect(browserStorage.getItem('testKey')).toBeNull();
    });

    it('should clear all items', () => {
      browserStorage.setItem('key1', 'value1');
      browserStorage.setItem('key2', 'value2');
      browserStorage.clear();
      expect(browserStorage.getItem('key1')).toBeNull();
      expect(browserStorage.getItem('key2')).toBeNull();
    });
  });

  describe('exists', () => {
    it('should return true for existing items', () => {
      browserStorage.setItem('testKey', 'testValue');
      expect(browserStorage.exists('testKey')).toBe(true);
    });

    it('should return false for non-existing items', () => {
      expect(browserStorage.exists('nonExistentKey')).toBe(false);
    });
  });

  describe('Auth specific methods', () => {
    // Create a valid JWT with a future expiry
    const futureExpiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ exp: futureExpiry }))}.signature`;
    
    const mockAuthData = {
      jwt: mockJwt,
      sessionToken: 'mock.session.token',
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      },
    };

    it('should set and get auth data correctly', () => {
      browserStorage.setAuthData(mockAuthData);
      const result = browserStorage.getAuthData();
      expect(result).toEqual(mockAuthData);
    });

    it('should get individual auth components', () => {
      browserStorage.setAuthData(mockAuthData);
      expect(browserStorage.getJwt()).toBe(mockAuthData.jwt);
      expect(browserStorage.getSessionToken()).toBe(mockAuthData.sessionToken);
      expect(browserStorage.getUserData()).toEqual(mockAuthData.user);
    });

    it('should clear auth data', () => {
      browserStorage.setAuthData(mockAuthData);
      browserStorage.clearAuthData();
      expect(browserStorage.getAuthData()).toBeNull();
      expect(browserStorage.getJwt()).toBeNull();
      expect(browserStorage.getSessionToken()).toBeNull();
      expect(browserStorage.getUserData()).toBeNull();
    });

    it('should check authentication status correctly', () => {
      expect(browserStorage.isAuthenticated()).toBe(false);
      browserStorage.setAuthData(mockAuthData);
      expect(browserStorage.isAuthenticated()).toBe(true);
    });
  });

  describe('JWT expiry handling', () => {
    it('should set JWT expiry correctly', () => {
      const futureExpiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ exp: futureExpiry }))}.signature`;
      
      browserStorage.setAuthData({
        jwt: mockJwt,
        sessionToken: 'mock.session.token',
        user: {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
        },
      });
      
      const expiry = browserStorage.getJwtExpiry();
      expect(expiry).toBe(futureExpiry * 1000); // Convert to milliseconds
    });

    it('should detect expired JWT', () => {
      const pastDate = Date.now() - 1000; // 1 second ago
      mockLocalStorage['jwt_expiry'] = JSON.stringify(pastDate);
      expect(browserStorage.isJwtExpired()).toBe(true);
    });

    it('should detect valid JWT', () => {
      const futureDate = Date.now() + 1000; // 1 second in future
      mockLocalStorage['jwt_expiry'] = JSON.stringify(futureDate);
      expect(browserStorage.isJwtExpired()).toBe(false);
    });

    it('should handle missing JWT expiry', () => {
      expect(browserStorage.isJwtExpired()).toBe(true);
    });
  });
}); 