
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailLoginForm from "./EmailLoginForm";
import PhoneLoginForm from "./PhoneLoginForm";

const LoginTabs = () => {
  const [error, setError] = useState("");

  return (
    <Tabs defaultValue="email" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/50">
        <TabsTrigger 
          value="email" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Email
        </TabsTrigger>
        <TabsTrigger 
          value="phone" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Phone
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="email">
        <EmailLoginForm setError={setError} error={error} />
      </TabsContent>
      
      <TabsContent value="phone">
        <PhoneLoginForm setError={setError} error={error} />
      </TabsContent>
    </Tabs>
  );
};

export default LoginTabs;
