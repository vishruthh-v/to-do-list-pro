
import React, { createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useAuthMethods } from "@/hooks/useAuthMethods";

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phone: string) => Promise<void>;
  verifyPhone: (phone: string, token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, session, isAuthenticated, isLoading: sessionLoading } = useAuthSession();
  const { 
    login, 
    register, 
    loginWithGoogle, 
    loginWithPhone, 
    verifyPhone, 
    logout, 
    isLoading: methodsLoading 
  } = useAuthMethods();

  const value = {
    user,
    session,
    login,
    register,
    loginWithGoogle,
    loginWithPhone,
    verifyPhone,
    logout,
    isAuthenticated,
    isLoading: sessionLoading || methodsLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
