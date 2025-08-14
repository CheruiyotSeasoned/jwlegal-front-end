import { Button } from "@/components/ui/button";
import { Scale, Menu, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-legal-muted sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-legal-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-legal-primary">Legal Buddy</span>
              <span className="text-xs text-muted-foreground">AI-Powered Legal Research</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-foreground hover:text-legal-primary transition-colors">
              Features
            </a>
            <a href="#user-types" className="text-foreground hover:text-legal-primary transition-colors">
              User Types
            </a>
            <a href="#pricing" className="text-foreground hover:text-legal-primary transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-foreground hover:text-legal-primary transition-colors">
              About
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/login">
              <Button variant="outline" className="border-legal-primary text-legal-primary hover:bg-legal-primary hover:text-primary-foreground">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
  <Button variant="outline" className="bg-legal-primary hover:bg-legal-primary/90 text-primary-foreground w-full">
    Get Started
  </Button>
</Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-legal-muted">
            <nav className="py-4 space-y-3">
              <a href="#features" className="block py-2 text-foreground hover:text-legal-primary transition-colors">
                Features
              </a>
              <a href="#user-types" className="block py-2 text-foreground hover:text-legal-primary transition-colors">
                User Types
              </a>
              <a href="#pricing" className="block py-2 text-foreground hover:text-legal-primary transition-colors">
                Pricing
              </a>
              <a href="#about" className="block py-2 text-foreground hover:text-legal-primary transition-colors">
                About
              </a>
              <div className="pt-3 space-y-2">
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full border-legal-primary text-legal-primary hover:bg-legal-primary hover:text-primary-foreground">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Button className="w-full bg-legal-primary hover:bg-legal-primary/90 text-primary-foreground">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};