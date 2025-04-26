interface UserData {
  id: string;
  email: string;
  name: string;
}

interface AuthData {
  jwt: string;
  sessionToken: string;
  user: UserData;
}

class BrowserStorage {
    private static readonly AUTH_KEY = 'auth_data';
    private static readonly JWT_KEY = 'jwt_token';
    private static readonly SESSION_KEY = 'session_token';
    private static readonly USER_KEY = 'user_data';
    private static readonly JWT_EXPIRY_KEY = 'jwt_expiry';

    setItem<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error(`Error setting item ${key} in localStorage:`, error);
        }
    }

    getItem<T>(key: string, defaultValue: T | null = null): T | null {
        try {
            const serializedValue = localStorage.getItem(key);
            if (serializedValue === null) {
                return defaultValue;
            }
            return JSON.parse(serializedValue) as T;
        } catch (error) {
            console.error(`Error getting item ${key} from localStorage:`, error);
            return defaultValue;
        }
    }

    removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing item ${key} from localStorage:`, error);
        }
    }

    clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error(`Error clearing localStorage:`, error);
        }
    }

    exists(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    // Auth specific methods
    setAuthData(authData: AuthData): void {
        this.setItem(BrowserStorage.AUTH_KEY, authData);
        this.setItem(BrowserStorage.JWT_KEY, authData.jwt);
        this.setItem(BrowserStorage.SESSION_KEY, authData.sessionToken);
        this.setItem(BrowserStorage.USER_KEY, authData.user);
        
        // Set JWT expiry
        if (authData.jwt) {
            const payload = JSON.parse(atob(authData.jwt.split('.')[1]));
            this.setItem(BrowserStorage.JWT_EXPIRY_KEY, payload.exp * 1000); // Convert to milliseconds
        }
    }

    getAuthData(): AuthData | null {
        return this.getItem<AuthData>(BrowserStorage.AUTH_KEY);
    }

    getJwt(): string | null {
        return this.getItem<string>(BrowserStorage.JWT_KEY);
    }

    getSessionToken(): string | null {
        return this.getItem<string>(BrowserStorage.SESSION_KEY);
    }

    getUserData(): UserData | null {
        return this.getItem<UserData>(BrowserStorage.USER_KEY);
    }

    clearAuthData(): void {
        this.removeItem(BrowserStorage.AUTH_KEY);
        this.removeItem(BrowserStorage.JWT_KEY);
        this.removeItem(BrowserStorage.SESSION_KEY);
        this.removeItem(BrowserStorage.USER_KEY);
        this.removeItem(BrowserStorage.JWT_EXPIRY_KEY);
    }

    isAuthenticated(): boolean {
        return this.exists(BrowserStorage.JWT_KEY) && this.exists(BrowserStorage.SESSION_KEY);
    }

    isJwtExpired(): boolean {
        const expiry = this.getItem<number>(BrowserStorage.JWT_EXPIRY_KEY);
        if (!expiry) return true;
            return Date.now() >= expiry;
    }

    getJwtExpiry(): number | null {
        return this.getItem<number>(BrowserStorage.JWT_EXPIRY_KEY);
    }
}

export const browserStorage = new BrowserStorage();
