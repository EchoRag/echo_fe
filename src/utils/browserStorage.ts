interface UserData {
  id: string;
  email: string;
  name: string;
}

interface AuthData {
  token: string;
  user: UserData;
}

class BrowserStorage {
    private static readonly AUTH_KEY = 'auth_data';
    private static readonly TOKEN_KEY = 'auth_token';
    private static readonly USER_KEY = 'user_data';

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
        this.setItem(BrowserStorage.TOKEN_KEY, authData.token);
        this.setItem(BrowserStorage.USER_KEY, authData.user);
    }

    getAuthData(): AuthData | null {
        return this.getItem<AuthData>(BrowserStorage.AUTH_KEY);
    }

    getToken(): string | null {
        return this.getItem<string>(BrowserStorage.TOKEN_KEY);
    }

    getUserData(): UserData | null {
        return this.getItem<UserData>(BrowserStorage.USER_KEY);
    }

    clearAuthData(): void {
        this.removeItem(BrowserStorage.AUTH_KEY);
        this.removeItem(BrowserStorage.TOKEN_KEY);
        this.removeItem(BrowserStorage.USER_KEY);
    }

    isAuthenticated(): boolean {
        return this.exists(BrowserStorage.TOKEN_KEY);
    }

    // Helper method to check if token is expired
    isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000; // Convert to milliseconds
            return Date.now() >= expiry;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    }
}

export const browserStorage = new BrowserStorage();
