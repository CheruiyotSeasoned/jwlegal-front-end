import { ReactNode } from "react";

interface BrowserFrameProps {
  children: ReactNode;
}

export const BrowserFrame = ({ children }: BrowserFrameProps) => {
  return (
    <div className="bg-gradient-hero min-h-screen p-5">
      <div className="bg-gray-100 rounded-xl h-[calc(100vh-2.5rem)] shadow-2xl overflow-hidden">
        {/* Browser Header */}
        <div className="bg-gray-200 h-10 flex items-center px-4 border-b border-gray-300">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="bg-white rounded-md px-3 py-1.5 ml-16 flex-1 max-w-xs flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3.5 h-3.5 text-gray-500">🔒</div>
            Assistant
          </div>
        </div>
        
        {/* Content */}
        <div className="h-[calc(100%-2.5rem)] bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};