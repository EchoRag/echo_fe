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

  // Check token expiration using token expiry
  useEffect(() => {
    if (token) {
      const checkTokenExpiration = async () => {
        if (browserStorage.isTokenExpired()) {
          console.log('Token expired, attempting to refresh');
          try {
            // Try to get a new token from Clerk
            const newToken = await getToken();
            if (newToken) {
              console.log('Successfully refreshed token');
              browserStorage.setAuthData({
                token: newToken as string,
                user: user as UserData,
              });
              setToken(newToken);
              return;
            }
          } catch (error) {
            console.error('Error refreshing token:', error);
          }
          
          // If we couldn't refresh the token, then clear auth data
          console.log('Failed to refresh token, clearing auth data');
          browserStorage.clearAuthData();
          setUser(null);
          setToken(null);
        }
      };

      // Get token expiry time
      const tokenExpiry = browserStorage.getTokenExpiry();
      if (tokenExpiry) {
        const timeUntilExpiry = tokenExpiry - Date.now();
        console.log(`Setting token expiry timeout for ${Math.round(timeUntilExpiry / 1000)} seconds`);
        
        // Set a timeout to check token expiration
        const timeout = setTimeout(checkTokenExpiration, timeUntilExpiry);
        return () => clearTimeout(timeout);
      }
    }
  }, [token, getToken, user]);

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
          console.log('Clearing auth data due to token fetch error');
          browserStorage.clearAuthData();
          setUser(null);
          setToken(null);
        }
      } else {
        console.log('User not signed in, clearing auth data');
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