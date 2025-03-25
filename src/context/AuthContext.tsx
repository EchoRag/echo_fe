import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, token: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn) {
        const token = await getToken();
        setToken(token);
      } else {
        setToken(null);
      }
      setLoading(false);
    };

    if (isLoaded) {
      fetchToken();
    }
  }, [isSignedIn, getToken, isLoaded]);

  return (
    <AuthContext.Provider value={{ user, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);