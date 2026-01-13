import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard, Wallet } from "lucide-react"; // Added Wallet icon
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full bg-dark dark:bg-black/50 backdrop-blur-xl z-50 border-b border-gray-200 dark:border-white/10 transition-all duration-300">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* New "Finora" Logo (No Image Required) */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* The CSS Icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          {/* The Gradient Text */}
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tighter">
            Finora.
          </span>
        </Link>

        {/* Navigation Links - Signed Out */}
        <div className="hidden md:flex items-center space-x-8">
          <SignedOut>
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
              Testimonials
            </a>
          </SignedOut>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 gap-2 flex items-center">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href="/transaction/create">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200">
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-white dark:border-gray-800 shadow-sm",
                },
              }}
            />
          </SignedIn>
          
        </div>
      </nav>
    </header>
  );
};

export default Header;