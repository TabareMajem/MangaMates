"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LineCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // The auth state change listener in AuthProvider will handle the session
    // Just redirect to the dashboard after a short delay
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-bold mb-2">Logging you in...</h1>
      <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
    </div>
  );
} 