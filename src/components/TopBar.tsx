import { Menu, HelpCircle, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onMenuToggle?: () => void;
}

export const TopBar = ({ onMenuToggle }: TopBarProps) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold text-foreground">LegalAI</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button className="bg-legal-dark text-white hover:bg-legal-dark/90 font-medium">
          ⚖️ Pro Plan
        </Button>
        
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5 text-legal-gray" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Gift className="w-5 h-5 text-legal-gray" />
          </button>
          <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center text-white text-sm font-semibold">
            SM
          </div>
        </div>
      </div>
    </div>
  );
};