import { useAuthContext } from '../context/AuthContext';

export const useAuthToken = () => {
  const { token } = useAuthContext();
  return token;
};
