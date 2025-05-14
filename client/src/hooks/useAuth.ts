import { useLocation } from 'wouter';
import { useAuth as useAuthContext } from '@/context/AuthContext';
import { LoginCredentials } from '@/types';

/**
 * A hook that provides authentication related functionality with enhanced navigation
 */
export function useAuth() {
  const auth = useAuthContext();
  const [, setLocation] = useLocation();
  
  // Enhanced login function that redirects based on user type
  const enhancedLogin = async (email: string, password: string) => {
    const credentials: LoginCredentials = { email, password };
    const success = await auth.login(credentials);
    
    if (success) {
      // Redirect based on user type
      if (auth.userType === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/dashboard');
      }
      return true;
    }
    
    return false;
  };
  
  // Enhanced logout function that redirects to login
  const enhancedLogout = () => {
    auth.logout();
    setLocation('/');
  };
  
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    userType: auth.userType,
    login: auth.login,
    logout: auth.logout,
    enhancedLogin,
    enhancedLogout,
  };
}
