"use client";

import * as React from "react";
import { Toaster } from "@/components/ui/sonner"; // эсвэл "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
  <SessionProvider>
     
        {children}
        <Toaster richColors position="top-right" />
     
    </SessionProvider>
  );
}
