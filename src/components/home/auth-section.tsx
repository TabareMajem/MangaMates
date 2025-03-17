"use client";

import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/context";

export function AuthSection() {
  const { user } = useAuth();

  if (user) return null;

  return (
    <section className="py-16 bg-white/5">
      <div className="container mx-auto px-4">
        <Card className="p-8 bg-white/10 backdrop-blur-sm border-none">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="text-muted-foreground mb-8">
              Create an account to save your results, track your progress, and unlock premium features.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
