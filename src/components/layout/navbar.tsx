"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Shield, Menu, X, Sparkles, LogOut, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "/verify", label: "Verify Proof" },
  { href: "/verifier", label: "Verifier Portal" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    setProfileOpen(false);
    setIsOpen(false);
    await signOut();
    router.push("/");
  };

  // Handle scroll - hide navbar on scroll down, show on scroll up
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Close mobile menu on any scroll
    if (isOpen) {
      setIsOpen(false);
    }
    
    // Only hide/show after scrolling past 100px
    if (currentScrollY > 100) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setHidden(true);
      } else {
        // Scrolling up
        setHidden(false);
      }
    } else {
      setHidden(false);
    }
    
    setLastScrollY(currentScrollY);
  }, [lastScrollY, isOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const getInitials = (name: string, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email[0].toUpperCase();
  };

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-xl border-b border-green-500/10 transition-transform duration-300",
          hidden && !isOpen && "-translate-y-full"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg text-white">AkshayaVault</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-20 h-9 bg-dark-800 rounded-lg animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Link href="/vault">
                    <Button size="sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      My Vault
                    </Button>
                  </Link>
                  
                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-dark-800 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {getInitials(user.name, user.email)}
                      </div>
                      <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", profileOpen && "rotate-180")} />
                    </button>
                    
                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-dark-900 border border-green-500/20 rounded-xl shadow-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-green-500/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-medium">
                              {getInitials(user.name, user.email)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{user.name || 'User'}</p>
                              <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <Link 
                            href="/vault" 
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4" />
                            My Vault
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <button
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu - separate from navbar for better control */}
      <div 
        className={cn(
          "md:hidden fixed inset-0 z-40 transition-all duration-300",
          isOpen ? "visible" : "invisible pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu panel */}
        <div 
          className={cn(
            "absolute top-16 left-0 right-0 bottom-0 bg-dark-950 transition-transform duration-300 overflow-y-auto",
            isOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <div className="px-6 py-6 space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block text-lg text-gray-300 hover:text-white py-4 border-b border-green-500/10 transition-all duration-300",
                  isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                )}
                style={{ transitionDelay: isOpen ? `${index * 50}ms` : "0ms" }}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-6 space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 text-gray-400 py-4 border-b border-green-500/10">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-medium">
                      {getInitials(user.name, user.email)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/vault" onClick={() => setIsOpen(false)}>
                    <Button className="w-full mt-4">
                      <Sparkles className="w-4 h-4 mr-2" />
                      My Vault
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full mt-3">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
