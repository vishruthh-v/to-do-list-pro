
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
import { Button } from "@/components/ui/button";
import { MailCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const EmailVerification = () => {
  const { user } = useAuth();
  const email = user?.email || sessionStorage.getItem("pendingVerificationEmail") || "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-2">
          <CardHeader className="space-y-1">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-center text-2xl">Check your email</CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent a verification link to:
            </CardDescription>
            <p className="text-center font-medium">{email}</p>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Please check your email and click the verification link to complete your registration.
              After verifying your email, you&apos;ll be able to sign in to your account.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/login" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Login
              </Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Didn&apos;t receive an email? Check your spam folder or contact support.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
