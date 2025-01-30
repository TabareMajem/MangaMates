import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/auth/auth-form";
import { SocialAuth } from "@/components/auth/social-auth";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f3e7ff] to-[#e7d1ff] dark:from-[#1a0f1f] dark:to-[#150c2e] py-16">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="p-6 bg-white/10 backdrop-blur-sm border-none">
          <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
          <AuthForm mode="signup" />
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <SocialAuth />
        </Card>
      </div>
    </main>
  );
}
