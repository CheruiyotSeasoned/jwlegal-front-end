import { Search, MessageCircle, GitBranch, FileText, SearchIcon, Shield, Clock, Settings, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  hasNew?: boolean;
  hasAdd?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, isActive, hasNew, hasAdd, onClick }: NavItemProps) => (
  <div
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 mx-5 rounded-lg cursor-pointer transition-all duration-200",
      isActive 
        ? "bg-primary text-primary-foreground" 
        : "text-legal-gray hover:bg-legal-light"
    )}
  >
    <div className="w-5 h-5">{icon}</div>
    <span className="text-sm font-medium flex-1">{label}</span>
    {hasNew && (
      <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-semibold">
        NEW
      </span>
    )}
    {hasAdd && (
      <button className="w-6 h-6 rounded-full bg-gray-100 hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center">
        <Plus className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("assistant");

  const navItems = [
    { id: "assistant", icon: <MessageCircle />, label: "Legal Assistant", isActive: true },
    { id: "cases", icon: <GitBranch />, label: "Case Management" },
    { id: "contracts", icon: <FileText />, label: "Contract Analysis" },
    { id: "research", icon: <SearchIcon />, label: "Legal Research", hasAdd: true },
    { id: "compliance", icon: <Shield />, label: "Compliance Check", hasNew: true },
    { id: "history", icon: <Clock />, label: "History" },
  ];

  return (
    <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 mb-6">
        <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center text-white">
          ⚖️
        </div>
        <span className="text-lg font-semibold text-foreground">LegalAI</span>
      </div>

      {/* Search */}
      <div className="px-5 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            placeholder="Search" 
            className="pl-10 bg-white border-gray-200 focus:border-primary"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeItem === item.id}
            hasNew={item.hasNew}
            hasAdd={item.hasAdd}
            onClick={() => setActiveItem(item.id)}
          />
        ))}
      </nav>

      {/* Theme Switcher & User Profile */}
      <div className="p-5 border-t border-gray-200">
        <div className="flex gap-4 mb-5">
          <button className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-md">
            ☀️ Light
          </button>
          <button className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
            🌙 Dark
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center text-white font-semibold">
            SM
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Sarah J. Mitchell</h4>
            <p className="text-xs text-legal-gray">sarah@lawfirm.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};