import { createContext, useContext, useState, ReactNode } from 'react';
import { User, LoginCredentials, AuthContextType, UserType } from '@/types';
import { users } from '@/mocks/data';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  userType: null,
  login: async () => false,
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // In a real app, we would check for session/token in localStorage
  // For this mock, we'll simulate a user session
  const [user, setUser] = useState<User | null>(null);
  
  const isAuthenticated = !!user;
  const userType: UserType | null = user ? user.type : null;
  
  // Login function - in a real app, this would call an API
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user with matching credentials
    const foundUser = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    
    return false;
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
