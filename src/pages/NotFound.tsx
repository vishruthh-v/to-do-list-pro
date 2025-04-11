
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileWarning } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-primary/20 blur-lg" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <FileWarning className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">404 - Not Found</h1>
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
          <Button asChild>
            <Link to="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
