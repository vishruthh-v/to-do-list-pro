
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SocialLoginProps {
  setError: (error: string) => void;
}

const SocialLogin = ({ setError }: SocialLoginProps) => {
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : "Google login failed. Please try again."
      );
    }
  };

  return (
    <div className="px-6 pb-2">
      <div className="relative flex items-center py-2">
        <Separator className="flex-1" />
        <span className="mx-2 text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>
      
      <Button
        type="button"
        variant="outline"
        className="w-full mb-4 border-primary/30 hover:bg-primary/10"
        onClick={handleGoogleLogin}
      >
        <Globe className="mr-2 h-4 w-4 text-primary" />
        Continue with Google
      </Button>
    </div>
  );
};

export default SocialLogin;
