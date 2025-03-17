"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TwitterCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data?.session) {
          router.push('/dashboard');
        } else {
          setError("Authentication failed. Please try again.");
          setTimeout(() => router.push('/auth/login'), 3000);
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Authentication error. Please try again.");
        setTimeout(() => router.push('/auth/login'), 3000);
      }
    };
    
    handleCallback();
  }, [router]);
  
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="mb-4 text-red-500">{error}</div>
        <div>Redirecting to login page...</div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
      <div>Completing authentication...</div>
    </div>
  );
} 