
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AuthMethodsState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phone: string) => Promise<void>;
  verifyPhone: (phone: string, token: string) => Promise<void>;
  logout: () => void;
}

export function useAuthMethods(): AuthMethodsState & { isLoading: boolean } {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        throw error;
      }

      // Store email for verification page
      if (email) {
        sessionStorage.setItem("pendingVerificationEmail", email);
      }

      // Create profile entry
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              name,
            });

          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
        } catch (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account",
      });
      
      navigate("/verify-email");
    } catch (error: any) {
      console.error("Registration failed", error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with email and password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please check your credentials and try again.");
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error("Please verify your email before logging in.");
        } else {
          throw error;
        }
      }

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        // Check if it's a provider not enabled error
        if (error.message.includes("provider is not enabled") || error.message.includes("Unsupported provider")) {
          throw new Error("Google login is not enabled. Please contact the administrator to enable Google authentication.");
        }
        throw error;
      }
    } catch (error: any) {
      console.error("Google login failed", error);
      toast({
        title: "Google login failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Login with Phone
  const loginWithPhone = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        // Check if it's a provider not enabled error
        if (error.message.includes("provider is not enabled") || error.message.includes("Unsupported phone provider")) {
          throw new Error("Phone authentication is not enabled. Please contact the administrator to enable phone authentication.");
        }
        throw error;
      }

      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error: any) {
      console.error("Phone login failed", error);
      toast({
        title: "Phone login failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Verify phone OTP
  const verifyPhone = async (phone: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: "sms",
      });

      if (error) {
        throw error;
      }

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Phone verification failed", error);
      toast({
        title: "Verification failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Logout failed", error);
      toast({
        title: "Logout failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  return {
    login,
    register,
    loginWithGoogle,
    loginWithPhone,
    verifyPhone,
    logout,
    isLoading,
  };
}
