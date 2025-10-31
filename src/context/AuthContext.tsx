import { createContext } from 'react';

export interface AuthContextType {
  user: any | null;
  setUser: (user: any) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});
