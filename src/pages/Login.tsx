
import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import LoginTabs from "@/components/auth/LoginTabs";
import SocialLogin from "@/components/auth/SocialLogin";

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="space-y-1 bg-gradient-to-r from-primary/10 to-transparent rounded-t-lg">
            <CardTitle className="text-center text-2xl font-bold text-foreground">Login</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred login method
            </CardDescription>
          </CardHeader>
          
          <LoginTabs />
          
          <SocialLogin setError={() => {}} />
          
          <CardFooter className="flex flex-col space-y-2 bg-gradient-to-r from-transparent to-primary/10 rounded-b-lg">
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
