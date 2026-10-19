import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session on browser refresh / initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('agri_shield_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse cached user data:', err);
        localStorage.removeItem('agri_shield_user');
        localStorage.removeItem('agri_shield_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Delegates network request to your auth service
    const response = await authService.login(email, password);
    
    // Save state & persist token/user info
    setUser(response.user);
    localStorage.setItem('agri_shield_user', JSON.stringify(response.user));
    localStorage.setItem('agri_shield_token', response.token);
    
    return response.user;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem('agri_shield_user');
    localStorage.removeItem('agri_shield_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);