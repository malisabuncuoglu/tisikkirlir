"use client";

import { ToastProvider } from "@/components/ui/toast";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <KeyboardShortcuts />
    </ToastProvider>
  );
}
