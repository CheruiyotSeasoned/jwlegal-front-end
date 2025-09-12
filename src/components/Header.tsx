import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/yellow-blue-removebg-preview.png";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Legal Buddy Logo" className="h-10 w-auto" />
            <span className="hidden sm:block text-xs text-gray-500">
              AI-Powered Legal Research
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {["Features", "User Types", "Pricing", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-gray-700 hover:text-[#003580] font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/login">
              <Button
                variant="outline"
                className="border-[#003580] text-[#003580] hover:bg-[#003580] hover:text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-[#FEA919] hover:bg-[#e68c0c] text-white">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden border-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-md animate-slideDown">
            <nav className="py-4 space-y-3">
              {["Features", "User Types", "Pricing", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="block py-2 text-gray-700 hover:text-[#003580] font-medium transition-colors"
                >
                  {item}
                </a>
              ))}
              <div className="pt-3 space-y-2">
                <Link to="/login" className="block">
                  <Button className="w-full border-[#003580] text-[#003580] hover:bg-[#003580] hover:text-white">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button className="w-full bg-[#FEA919] hover:bg-[#e68c0c] text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
