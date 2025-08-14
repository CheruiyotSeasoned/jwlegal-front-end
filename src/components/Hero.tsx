import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bot, Shield, Clock, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero.jpg"; 
import React, { useState } from "react";
import { LegalAIDialog } from "./LegalAIDialog";

export const Hero = () => {
  const [isLegalAIOpen, setIsLegalAIOpen] = useState(false);

  return (
    <>
      <section className="py-20 lg:py-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-legal-primary leading-tight">
                  Your Trusted Legal{" "}
                  <span className="bg-gradient-legal bg-clip-text text-transparent">
                    Advisor
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Your trusted legal advisor from simple to complex legal issues for personal and corporate legal needs. Get instant legal advice, research, and support.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-legal-secondary" />
                  <span className="text-sm font-medium">Kenya Law Integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-legal-secondary" />
                  <span className="text-sm font-medium">Dedicated Legal Research Team</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-legal-secondary" />
                  <span className="text-sm font-medium">AI-Powered Legal Research</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-legal-primary hover:bg-legal-primary/90 text-primary-foreground shadow-legal group"
                  onClick={() => setIsLegalAIOpen(true)}
                >
                  Start Free Research
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-legal-primary text-legal-primary hover:bg-legal-primary hover:text-primary-foreground"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-legal-muted">
                <Card className="text-center shadow-card-legal">
                  <CardContent className="p-4">
                    <Bot className="h-8 w-8 text-legal-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">AI + Human Expertise</p>
                  </CardContent>
                </Card>
                <Card className="text-center shadow-card-legal">
                  <CardContent className="p-4">
                    <Shield className="h-8 w-8 text-legal-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Data Protection Compliant</p>
                  </CardContent>
                </Card>
                <Card className="text-center shadow-card-legal">
                  <CardContent className="p-4">
                    <Clock className="h-8 w-8 text-legal-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">24-Hour Responses</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="legal BuddyS" 
                  className="w-full h-auto rounded-lg shadow-legal"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-legal-secondary text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg z-10">
                Kenya Law APIs
              </div>
              <div className="absolute -bottom-4 -left-4 bg-legal-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-lg z-10">
                AI-Ready Legal Assistant
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal AI Dialog */}
      <LegalAIDialog 
        open={isLegalAIOpen} 
        onOpenChange={setIsLegalAIOpen} 
      />
    </>
  );
};