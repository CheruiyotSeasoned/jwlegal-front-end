import { Scale, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-legal-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-legal-secondary" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">Legal Buddy</span>
                <span className="text-xs text-primary-foreground/70">AI-Powered Legal Research</span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Transforming legal practice in Kenya through intelligent AI-powered research tools, 
              connecting legal professionals with comprehensive case law and legislative databases.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary" className="text-legal-primary">
                <ExternalLink className="h-4 w-4 mr-2" />
                Kenya Law
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-legal-secondary">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-primary-foreground/80 hover:text-legal-secondary transition-colors">Features</a></li>
              <li><a href="#user-types" className="text-sm text-primary-foreground/80 hover:text-legal-secondary transition-colors">User Types</a></li>
              <li><a href="#pricing" className="text-sm text-primary-foreground/80 hover:text-legal-secondary transition-colors">Pricing</a></li>
              <li><a href="#about" className="text-sm text-primary-foreground/80 hover:text-legal-secondary transition-colors">About Us</a></li>
              <li><a href="/api-docs" className="text-sm text-primary-foreground/80 hover:text-legal-secondary transition-colors">API Documentation</a></li>
            </ul>
          </div>

          {/* Legal Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-legal-secondary">Legal Areas</h3>
            <ul className="space-y-2">
              <li><a href="/traffic" className="text-sm text-primary-foreground/80 hover:text-legal-secondary transition-colors">Traffic Law</a></li>
              <li><a href="/criminal" className="text-sm text-primary-foreground/80 hover:text-legal-secondary transition-colors">Criminal Law</a></li>
              <li><a href="/civil" className="text-sm text-primary-foreground/80 hover:text-legal-secondary transition-colors">Civil Matters</a></li>
              <li><a href="/constitutional" className="text-sm text-primary-foreground/80 hover:text-legal-secondary transition-colors">Constitutional Law</a></li>
              <li><a href="/categories" className="text-sm text-primary-foreground/80 hover:text-legal-secondary transition-colors">All Categories</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-legal-secondary">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-legal-secondary" />
                <span className="text-sm text-primary-foreground/80">info@jwlegalsearch.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-legal-secondary" />
                <span className="text-sm text-primary-foreground/80">+254 700 000 000</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-legal-secondary" />
                <span className="text-sm text-primary-foreground/80">Nairobi, Kenya</span>
              </div>
            </div>
            <div className="pt-2">
              <Button 
                size="sm" 
                className="bg-legal-secondary hover:bg-legal-secondary/90 text-white"
              >
                Get Support
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-sm text-primary-foreground/70">
              © {currentYear} Legal Buddy. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="/privacy" className="text-sm text-primary-foreground/70 hover:text-legal-secondary transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-primary-foreground/70 hover:text-legal-secondary transition-colors">
                Terms of Service
              </a>
              <a href="/data-protection" className="text-sm text-primary-foreground/70 hover:text-legal-secondary transition-colors">
                Data Protection
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-primary-foreground/70">Powered by</span>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-legal-secondary">Kenya Law APIs</span>
              <span className="text-sm text-primary-foreground/70">+</span>
              <span className="text-sm font-medium text-legal-secondary">AI Technology</span>
            </div>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="mt-8 p-4 bg-primary-foreground/10 rounded-lg">
          <p className="text-xs text-primary-foreground/70 text-center leading-relaxed">
            Legal Buddy is compliant with the Kenya Data Protection Act 2019. 
            We are registered as a data controller and processor. All legal advice should be verified by qualified legal professionals.
          </p>
        </div>
      </div>
    </footer>
  );
};