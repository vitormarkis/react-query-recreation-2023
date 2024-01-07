"use client";

import { QueryProvider } from "@/hooks/QueryStorageContext";
import React from "react";

export function Providers({ children }: React.PropsWithChildren) {
  return <QueryProvider>{children}</QueryProvider>;
}
