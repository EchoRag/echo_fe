import { useAuthContext } from '../context/AuthContext';

export const useAuthToken = () => {
  const { jwt } = useAuthContext();
  return jwt;
};
