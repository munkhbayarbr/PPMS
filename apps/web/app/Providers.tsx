"use client";

import * as React from "react";
import { Toaster } from "@/components/ui/sonner"; // эсвэл "@/components/ui/toaster"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
