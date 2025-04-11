
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Define the shape of our user object
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data (for demo purposes)
const MOCK_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("todoProUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("todoProUser");
      }
    }
    setIsLoading(false);
  }, []);

  // Login function - mock implementation
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Mock validation
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // Omit password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in local storage
      localStorage.setItem("todoProUser", JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function - mock implementation
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Check if user already exists
      if (MOCK_USERS.some((u) => u.email === email)) {
        throw new Error("User with this email already exists");
      }
      
      // In a real app, we would send this to an API
      // For demo, just add to our mock data
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        name,
        email,
        password,
      };
      
      MOCK_USERS.push(newUser);
      
      toast({
        title: "Registration successful",
        description: "You can now log in with your credentials",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("todoProUser");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading,
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
