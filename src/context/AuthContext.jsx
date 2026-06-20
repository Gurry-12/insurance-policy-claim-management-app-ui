import { createContext, useState, useCallback } from 'react';
import { getToken, getUser, saveToken, saveUser, clearAuth } from '../utils/storageUtils';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(() => getUser());

  const isAuthenticated = !!token;

  const login = useCallback((newToken, newUser) => {
    saveToken(newToken);
    saveUser(newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};