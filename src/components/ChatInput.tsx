import { Paperclip, Mic, FileText, Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSend?: (message: string) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const maxLength = 3000;

  const handleSend = () => {
    if (message.trim()) {
      onSend?.(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-3 sm:p-5 mt-4 sm:mt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Summarize the latest legal case..."
          className="flex-1 w-full text-sm sm:text-base text-foreground placeholder-gray-500 outline-none"
          maxLength={maxLength}
        />
        
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Attach</span>
          </button>
          
          <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Voice</span>
          </button>
          
          <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Prompts</span>
          </button>
          
          <div className="text-xs text-gray-500">
            {message.length} / {maxLength}
          </div>
          
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};