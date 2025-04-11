
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4 text-center">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            To-Do Pro<span className="text-primary">+</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Boost your productivity with our powerful task management app. 
            Features include task tracking, focus timer, calendar view, and analytics.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/login")}>
            Log In
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>
        <div className="pt-8">
          <Button
            variant="ghost"
            className="group gap-1 text-primary"
            onClick={() => navigate("/dashboard")}
          >
            Try Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
