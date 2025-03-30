import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { browserStorage } from '../utils/browserStorage';

interface UserData {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, getToken } = useAuth();
  const { user: clerkUser, isLoaded } = useUser();
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from browser storage
  useEffect(() => {
    const storedAuthData = browserStorage.getAuthData();
    if (storedAuthData) {
      setUser(storedAuthData.user);
      setToken(storedAuthData.token);
    }
    setLoading(false);
  }, []);

  // Update auth state when Clerk auth changes
  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn && clerkUser) {
        try {
          const token = await getToken();
          const email = clerkUser.primaryEmailAddress?.emailAddress;
          
          if (!email) {
            throw new Error('No email address found');
          }

          const userData: UserData = {
            id: clerkUser.id,
            email,
            name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
          };

          // Store in browser storage
          browserStorage.setAuthData({
            token: token as string,
            user: userData,
          });

          setUser(userData);
          setToken(token);
        } catch (error) {
          console.error('Error fetching token:', error);
          browserStorage.clearAuthData();
          setUser(null);
          setToken(null);
        }
      } else {
        browserStorage.clearAuthData();
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    if (isLoaded) {
      fetchToken();
    }
  }, [isSignedIn, getToken, isLoaded, clerkUser]);

  // Check token expiration periodically
  useEffect(() => {
    if (token) {
      const checkTokenExpiration = () => {
        if (browserStorage.isTokenExpired()) {
          browserStorage.clearAuthData();
          setUser(null);
          setToken(null);
        }
      };

      // Check immediately
      checkTokenExpiration();

      // Check every minute
      const interval = setInterval(checkTokenExpiration, 60000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const signOut = () => {
    browserStorage.clearAuthData();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);