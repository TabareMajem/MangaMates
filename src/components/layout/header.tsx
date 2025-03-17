"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { UserNav } from "./user-nav";
import { useAuth } from "@/lib/auth/context";
import { useSubscriptionModal } from "@/hooks/use-subscription-modal";
import { Crown, Menu, X } from "lucide-react";

export function Header() {
  const { user } = useAuth();
  const { openModal } = useSubscriptionModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/character/list" className="text-sm font-medium hover:text-primary transition-colors">
                Characters
              </Link>
              <Link to="/journal" className="text-sm font-medium hover:text-primary transition-colors">
                Journal
              </Link>
              <Link to="/personality-quiz" className="text-sm font-medium hover:text-primary transition-colors">
                Quiz
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {!user.isPremium && (
                  <Button 
                    variant="premium" 
                    size="sm" 
                    onClick={openModal}
                    className="hidden sm:flex bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade
                  </Button>
                )}
                <UserNav />
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden sm:flex">
                  <Link to="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild className="hidden sm:flex">
                  <Link to="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/character/list" 
                className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Characters
              </Link>
              <Link 
                to="/journal" 
                className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Journal
              </Link>
              <Link 
                to="/personality-quiz" 
                className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Quiz
              </Link>
              {!user && (
                <>
                  <Link 
                    to="/auth/signin" 
                    className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/auth/signup" 
                    className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              {user && !user.isPremium && (
                <Button 
                  variant="premium" 
                  size="sm" 
                  onClick={() => {
                    openModal();
                    setIsMenuOpen(false);
                  }}
                  className="mx-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
