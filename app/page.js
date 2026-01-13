import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import HeroSection from "@/components/hero";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      
      {/* Background Gradient Mesh - The "Secret Sauce" */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-slate-950 bg-[radial-gradient(circle_500px_at_50%_200px,#1e293b,transparent)]"></div>

      {/* Hero Section */}
      {/* Make sure your HeroSection component handles dark mode text correctly! */}
      <HeroSection />

      {/* Stats Section with Glass Effect */}
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 rounded-2xl bg-white/5 p-10 backdrop-blur-lg border border-white/10 shadow-2xl">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2 transition-transform group-hover:scale-110 duration-300">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Everything you need to <br/> manage your finances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card 
                className="p-6 bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 group" 
                key={index}
              >
                <CardContent className="space-y-4 pt-4">
                  <div className="p-3 bg-blue-500/10 w-fit rounded-lg text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-950/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-100">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Connecting Line (Hidden on Mobile) */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-blue-900 to-transparent -z-10"></div>
                )}
                
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20 text-white">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-200">{step.title}</h3>
                <p className="text-slate-400 max-w-xs mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-100">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-slate-900/40 border-slate-800 text-slate-300">
                <CardContent className="pt-4">
                  <div className="flex items-center mb-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-700">
                        <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        />
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-blue-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-400 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Gradient Background for CTA */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to Master Your Money?
          </h2>
          <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg">
            Join thousands of users who are strictly managing their finances
            smarter with Welth.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-transform shadow-xl font-semibold px-8 py-6 text-lg rounded-full"
            >
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;