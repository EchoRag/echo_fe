import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useUser, useClerk } from '@clerk/clerk-react';
import { browserStorage } from '../utils/browserStorage';

interface UserData {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: UserData | null;
  jwt: string | null;
  sessionToken: string | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  jwt: null,
  sessionToken: null,
  loading: true,
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, getToken } = useAuth();
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const [user, setUser] = useState<UserData | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from browser storage
  useEffect(() => {
    const storedAuthData = browserStorage.getAuthData();
    if (storedAuthData) {
      setUser(storedAuthData.user);
      setJwt(storedAuthData.jwt);
      setSessionToken(storedAuthData.sessionToken);
    }
    setLoading(false);
  }, []);

  // Check JWT expiration
  useEffect(() => {
    if (jwt) {
      const checkJwtExpiration = async () => {
        if (browserStorage.isJwtExpired()) {
          console.log('JWT expired, attempting to refresh');
          try {
            // Get new JWT from Clerk with echo_default template
            const newJwt = await getToken({ template: 'echo_default' });
            if (newJwt) {
              console.log('Successfully refreshed JWT');
              const authData = browserStorage.getAuthData();
              if (authData) {
                browserStorage.setAuthData({
                  ...authData,
                  jwt: newJwt,
                });
                setJwt(newJwt);
              }
              return;
            }
          } catch (error) {
            console.error('Error refreshing JWT:', error);
          }
          
          // If we couldn't refresh the JWT, then clear auth data
          console.log('Failed to refresh JWT, clearing auth data');
          browserStorage.clearAuthData();
          setUser(null);
          setJwt(null);
          setSessionToken(null);
        }
      };

      const jwtExpiry = browserStorage.getJwtExpiry();
      if (jwtExpiry) {
        const timeUntilExpiry = jwtExpiry - Date.now();
        console.log(`Setting JWT expiry timeout for ${Math.round(timeUntilExpiry / 1000)} seconds`);
        
        const timeout = setTimeout(checkJwtExpiration, timeUntilExpiry);
        return () => clearTimeout(timeout);
      }
    }
  }, [jwt, getToken]);

  // Update auth state when Clerk auth changes
  useEffect(() => {
    const fetchTokens = async () => {
      if (!isLoaded) return;

      if (isSignedIn && clerkUser) {
        try {
          // Get both tokens concurrently
          const [jwtToken, sessionToken] = await Promise.all([
            getToken({ template: 'echo_default' }),
            getToken(),
          ]);

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
            jwt: jwtToken as string,
            sessionToken: sessionToken as string,
            user: userData,
          });

          setUser(userData);
          setJwt(jwtToken);
          setSessionToken(sessionToken);
        } catch (error) {
          console.error('Error fetching tokens:', error);
          console.log('Clearing auth data due to token fetch error');
          browserStorage.clearAuthData();
          setUser(null);
          setJwt(null);
          setSessionToken(null);
        }
      } else {
        console.log('User not signed in, clearing auth data');
        browserStorage.clearAuthData();
        setUser(null);
        setJwt(null);
        setSessionToken(null);
      }
      setLoading(false);
    };

    if (isLoaded) {
      fetchTokens();
    }
  }, [isSignedIn, getToken, isLoaded, clerkUser]);

  const signOut = async () => {
    try {
      // Clear local storage first
      browserStorage.clearAuthData();
      setUser(null);
      setJwt(null);
      setSessionToken(null);
      
      // Then sign out from Clerk
      await clerkSignOut();
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, jwt, sessionToken, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);