
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Phone } from "lucide-react";

interface PhoneLoginFormProps {
  setError: (error: string) => void;
  error: string;
}

const PhoneLoginForm = ({ setError, error }: PhoneLoginFormProps) => {
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isPhoneSubmitted, setIsPhoneSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithPhone, verifyPhone } = useAuth();

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!isPhoneSubmitted) {
        await loginWithPhone(phone);
        setIsPhoneSubmitted(true);
      } else {
        await verifyPhone(phone, verificationCode);
      }
    } catch (err) {
      console.error("Phone login error:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Phone verification failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePhoneLogin}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
            <Phone className="h-4 w-4 text-primary" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={isPhoneSubmitted}
            className="border-primary/30 focus-visible:ring-primary"
          />
        </div>
        
        {isPhoneSubmitted && (
          <div className="space-y-2">
            <Label htmlFor="code" className="text-foreground">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              className="border-primary/30 focus-visible:ring-primary"
            />
          </div>
        )}
        
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}
        
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? "Processing..." 
            : isPhoneSubmitted 
              ? "Verify Code" 
              : "Send Code"}
        </Button>
        
        {isPhoneSubmitted && (
          <Button
            type="button"
            variant="outline"
            className="w-full border-primary/30"
            onClick={() => setIsPhoneSubmitted(false)}
          >
            Change Phone Number
          </Button>
        )}
      </div>
    </form>
  );
};

export default PhoneLoginForm;
