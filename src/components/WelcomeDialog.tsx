import { ActionCard } from "./ActionCard";
import { ChatInput } from "./ChatInput";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

export const WelcomeDialog = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleActionClick = (action: string) => {
    console.log(`Action clicked: ${action}`);
  };

  const handleSendMessage = (message: string) => {
    console.log(`Message sent: ${message}`);
    setChatStarted(true);
  };

  if (chatStarted) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="font-legal-display">Open Legal Assistant</Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl max-h-[85vh] overflow-y-auto font-legal-body p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-legal-display text-lg text-foreground">Legal Assistant</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="bg-accent/10 rounded-lg p-3">
              <strong className="text-foreground font-legal text-sm">You:</strong>
              <span className="ml-2 text-legal-gray text-sm">Help me analyze this contract...</span>
            </div>
            <div className="bg-card border rounded-lg p-3">
              <strong className="text-foreground font-legal text-sm">LegalAI:</strong>
              <span className="ml-2 text-legal-gray text-sm leading-relaxed">
                I'd be happy to help you analyze your contract. Please upload the document or paste the text, 
                and I'll provide a comprehensive review including key terms, potential risks, and recommendations.
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="text-xs font-legal">
                👍 Helpful
              </Button>
              <Button variant="outline" size="sm" className="text-xs font-legal">
                👎 Not helpful
              </Button>
              <Button variant="outline" size="sm" className="text-xs font-legal">
                🔄 Regenerate
              </Button>
            </div>
            <ChatInput onSend={handleSendMessage} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-legal-display">Open Legal Assistant</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl max-h-[85vh] overflow-y-auto font-legal-body p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-legal-display text-lg sm:text-xl text-foreground mb-2">Welcome to LegalAI</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          <p className="text-xs sm:text-sm text-legal-gray leading-relaxed font-legal">
            Get started by describing a legal task and our AI can do the rest. Not sure where to start?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <ActionCard
              icon="✍️"
              title="Contract Analysis"
              type="copy"
              onClick={() => handleActionClick("contract")}
            />
            <ActionCard
              icon="🔍"
              title="Legal Research"
              type="image"
              onClick={() => handleActionClick("research")}
            />
            <ActionCard
              icon="⚖️"
              title="Case Review"
              type="avatar"
              onClick={() => handleActionClick("case")}
            />
            <ActionCard
              icon="📋"
              title="Compliance Check"
              type="code"
              onClick={() => handleActionClick("compliance")}
            />
          </div>

          <ChatInput onSend={handleSendMessage} />

          <div className="text-center text-xs text-legal-gray font-legal">
            LegalAI may generate inaccurate information about legal matters. Always consult with qualified legal professionals. Model: LegalAI v2.1
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};