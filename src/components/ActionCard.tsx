import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  icon: string;
  title: string;
  type: "copy" | "image" | "avatar" | "code";
  onClick?: () => void;
}

const cardBackgrounds = {
  copy: "bg-action-copy",
  image: "bg-action-image", 
  avatar: "bg-action-avatar",
  code: "bg-action-code"
};

export const ActionCard = ({ icon, title, type, onClick }: ActionCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="group flex items-center gap-2 sm:gap-4 p-3 sm:p-5 border-2 border-gray-100 rounded-xl cursor-pointer transition-all duration-300 bg-white hover:border-primary hover:-translate-y-1 hover:shadow-hover"
    >
      <div className={cn(
        "w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl transition-transform duration-300 group-hover:scale-110",
        cardBackgrounds[type]
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-xs sm:text-sm text-foreground font-legal-display">{title}</h3>
      </div>
      <button className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </button>
    </div>
  );
};