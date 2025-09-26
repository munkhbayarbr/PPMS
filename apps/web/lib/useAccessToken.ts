"use client";

import { useSession } from "next-auth/react";

export function useAccessToken() {
  const { data } = useSession();
  return (data as any)?.accessToken as string | undefined;
}
