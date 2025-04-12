
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, User, Lock, Google, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(name, email, password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-[rgb(192,166,49)]/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-[rgb(192,166,49)]/30 focus-visible:ring-[rgb(192,166,49)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-[rgb(192,166,49)]/30 focus-visible:ring-[rgb(192,166,49)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="border-[rgb(192,166,49)]/30 focus-visible:ring-[rgb(192,166,49)]"
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-300">
                  {error}
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-[rgb(192,166,49)] hover:bg-[rgb(192,166,49)]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="relative flex items-center py-2">
                <Separator className="flex-1" />
                <span className="mx-2 text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full border-[rgb(192,166,49)]/30"
                onClick={handleGoogleLogin}
              >
                <Google className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[rgb(192,166,49)] underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
