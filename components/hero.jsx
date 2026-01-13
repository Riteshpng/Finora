"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect for the floating card
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pt-40 pb-20 px-4">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Side: Text */}
        <div className="lg:w-1/2 text-center lg:text-left z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-blue-100 via-blue-300 to-purple-400 bg-clip-text text-transparent pb-2">
            Master Your Money <br /> with AI Intelligence
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0">
            Stop guessing. Start tracking. Scan receipts, get real-time budgets, 
            and let AI guide your financial journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                Get Started Free
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800 px-8 py-6 text-lg rounded-full bg-black border-white/2 hover:bg-white/10">
                See Features
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Side: The "CSS Animation" (No Image) */}
        <div className="lg:w-1/2 relative w-full flex justify-center">
          
          {/* Background Glow Blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/30 rounded-full blur-[100px] -z-10 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-purple-500/20 rounded-full blur-[80px] -z-10" />

          {/* The Floating Glass Card */}
          <div 
            className="relative w-full max-w-[420px] bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transition-transform duration-200 ease-out will-change-transform"
            style={{ transform: `translateY(${scrollY * -0.1}px) rotateX(5deg)` }}
          >
            {/* Card Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-lg font-bold">W</span>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white">Main Wallet</div>
                        <div className="text-xs text-slate-400">**** 4291</div>
                    </div>
                </div>
                <div className="px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-xs font-medium">
                    +2.4%
                </div>
            </div>

            {/* Big Balance */}
            <div className="mb-6">
                <div className="text-sm text-slate-400 mb-1">Total Balance</div>
                <div className="text-4xl font-bold text-white">$12,450.00</div>
            </div>

            {/* Fake "Live" Chart Bars */}
            <div className="h-32 flex items-end justify-between gap-2 mb-6">
                {[40, 70, 45, 90, 60, 80, 50].map((height, i) => (
                    <div 
                        key={i} 
                        className="w-full bg-gradient-to-t from-blue-600/50 to-blue-400/50 rounded-t-sm transition-all duration-1000 ease-in-out"
                        style={{ height: `${height}%`, animation: `pulse 2s infinite ${i * 0.1}s` }}
                    />
                ))}
            </div>

            {/* Recent Transaction List */}
            <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-xs">🍔</div>
                        <div className="text-sm font-medium text-slate-200">Uber Eats</div>
                    </div>
                    <div className="text-sm font-medium text-white">-$24.50</div>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs">🎬</div>
                        <div className="text-sm font-medium text-slate-200">Netflix</div>
                    </div>
                    <div className="text-sm font-medium text-white">-$15.00</div>
                </div>
            </div>
            
            {/* Floating "Scan" Badge */}
            <div className="absolute -right-6 top-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg rotate-12 animate-bounce">
                New: AI Scan 📸
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}