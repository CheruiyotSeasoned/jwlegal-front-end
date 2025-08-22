import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { ProjectsSidebar } from "@/components/ProjectSidebar";
import {
  Send,
  Bot,
  User,
  FileText,
  Sparkles,
  Loader2,
  Copy,
  Menu,
  Shield,
  Scale,
  BookOpen,
  Home,
  Heart,
  Leaf,
  Gavel,
  Search,
  FolderOpen,
  Settings,
  Book,
  Database,
  CheckCircle,
  AlertCircle,
  XCircle,
  AlertTriangle,
  Briefcase,
  Mic,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getLegalQuickPrompts,
  handleDocumentAssistance,
  copyToClipboard,
  extractCitations,
  calculateConfidence
} from '@/lib/legalHelpers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
interface Message {
  searchType: any;
  disclaimer: boolean;
  legalArea: string | boolean;
  isError: string;
  id: string;
  type: "user" | "assistant" | "quick-question";
  content: string;
  timestamp: Date;
  citations?: string[];
  confidence?: number;
  isResearch?: boolean;
}

const legalCategories = [
  { id: "constitutional", label: "Constitutional Law", icon: Shield, color: "bg-blue-50 text-blue-700" },
  { id: "criminal", label: "Criminal Law", icon: Scale, color: "bg-red-50 text-red-700" },
  { id: "civil", label: "Civil Law", icon: FileText, color: "bg-green-50 text-green-700" },
  { id: "commercial", label: "Commercial Law", icon: BookOpen, color: "bg-purple-50 text-purple-700" },
  { id: "employment", label: "Employment Law", icon: User, color: "bg-orange-50 text-orange-700" },
  { id: "property", label: "Property Law", icon: Home, color: "bg-yellow-50 text-yellow-700" },
  { id: "family", label: "Family Law", icon: Heart, color: "bg-pink-50 text-pink-700" },
  { id: "environmental", label: "Environmental Law", icon: Leaf, color: "bg-emerald-50 text-emerald-700" },
];

const quickPrompts = [
  "What are the requirements for filing a civil suit in Kenya?",
  "Explain the constitutional rights of an accused person",
  "How do I register a business in Kenya?",
  "What are the grounds for divorce in Kenya?",
  "Explain the Data Protection Act 2019",
  "What are the penalties for traffic offenses?",
];

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm your AI Legal Research Assistant. I can help you with Kenyan law research, case analysis, legal document review, and more. What legal question can I help you with today?",
      timestamp: new Date(),
      legalArea: false,
      isError: "",
      searchType: undefined,
      disclaimer: false
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [selectedLegalArea, setSelectedLegalArea] = useState<string | null>(null);
  const [citationLevel, setCitationLevel] = useState<string>("medium"); // Add citationLevel state
  const [casePreference, setCasePreference] = useState<string>("recent"); // Add casePreference state

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showLegalSettings, setShowLegalSettings] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsProjectsMenuOpen(false);
      }
    };
    
    if (isMobileMenuOpen || isProjectsMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, isProjectsMenuOpen]);

// Enhanced legal chat handler for Kenya Legal Research Assistant
const handleSendMessage = async () => {
  if (!inputValue.trim() || isLoading) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    type: "user",
    content: inputValue,
    timestamp: new Date(),
    legalArea: false,
    isError: "",
    searchType: undefined,
    disclaimer: false
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");
  setIsLoading(true);
  setShowQuickQuestions(false);

  try {
    // Enhanced API call to match your new legal endpoint
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const res = await fetch(`${API_BASE_URL}/legal/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        message: userMessage.content,
        legal_area: selectedLegalArea || "general", // Dynamic legal area selection
        case_preference: casePreference || "recent", // User preference for cases
        citation_level: citationLevel || "medium", // Citation detail level
        context_history: getConversationHistory(), // history
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: data.reply,
      timestamp: new Date(),
      citations: extractCitations(data.reply),
      confidence: calculateConfidence(data.reply, data.legal_area),
      legalArea: false,
      isError: "",
      searchType: undefined,
      disclaimer: false
    };

    setMessages((prev) => [...prev, aiResponse]);
  } catch (err) {
    console.error("Legal chat error:", err);
    
    const errorResponse: Message = {
      id: (Date.now() + 2).toString(),
      type: "assistant",
      content: `I apologize, but I'm having trouble connecting to the legal research service. ${err.message || 'Please try again in a moment.'}`,
      timestamp: new Date(),
      legalArea: false,
      isError: "",
      searchType: undefined,
      disclaimer: false
    };
    setMessages((prev) => [...prev, errorResponse]);
  } finally {
    setIsLoading(false);
  }
};

// Helper function to get conversation history for context
const getConversationHistory = () => {
  // Get last 4 messages (2 exchanges) for context
  const recentMessages = messages.slice(-4).map(msg => ({
    role: msg.type === "user" ? "user" : "assistant",
    content: msg.content
  }));
  
  return recentMessages;
};

// Helper function to extract legal citations from response
const extractCitations = (responseText) => {
  const citations = [];
  
  // Extract case law citations (basic pattern matching)
  const casePattern = /\[(19|20)\d{2}\]\s*eKLR/gi;
  const cases = responseText.match(casePattern);
  if (cases) citations.push(...cases.map(c => ({ type: 'case', citation: c })));
  
  // Extract statutory citations
  const statutePattern = /(Act\s+\d{4}|Constitution.*2010)/gi;
  const statutes = responseText.match(statutePattern);
  if (statutes) citations.push(...statutes.map(s => ({ type: 'statute', citation: s })));
  
  // Default citations if none found
  if (citations.length === 0) {
    citations.push({ type: 'general', citation: 'Kenya Law Database' });
  }
  
  return citations;
};

// Helper function to calculate response confidence
const calculateConfidence = (responseText, legalArea) => {
  let confidence = 0.7; // Base confidence
  
  // Increase confidence if response contains legal citations
  if (responseText.includes('eKLR') || responseText.includes('Act')) confidence += 0.1;
  
  // Increase confidence for specialized legal areas
  if (legalArea !== 'general') confidence += 0.1;
  
  // Increase confidence if response is comprehensive (longer responses)
  if (responseText.length > 500) confidence += 0.05;
  
  // Cap at 0.95
  return Math.min(confidence, 0.95);
};

// Enhanced legal research function for specialized queries
const handleLegalResearch = async (query, searchType = "case_law") => {
  setIsLoading(true);
  
  try {
    const res = await fetch("http://localhost:8000/legal/research", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: query,
        search_type: searchType,
        jurisdiction: "kenya",
        date_range: getDateRange(), // Optional date filtering
      }),
    });

    if (!res.ok) {
      throw new Error(`Research API Error: ${res.status}`);
    }

    const data = await res.json();

    const researchResponse: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content: data.research_result,
      timestamp: new Date(),
      citations: [], // Optionally extract citations if needed
      confidence: undefined,
      legalArea: false,
      isError: "",
      searchType: undefined,
      disclaimer: false
    };

    setMessages((prev) => [...prev, researchResponse]);
  } catch (err) {
    console.error("Legal research error:", err);
    const errorResponse: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content: "I encountered an error while conducting legal research. Please try again.",
      timestamp: new Date(),
      legalArea: false,
      isError: "",
      searchType: undefined,
      disclaimer: false
    };
    setMessages((prev) => [...prev, errorResponse]);
  } finally {
    setIsLoading(false);
  }
};

// Quick question handlers for common legal queries
const handleQuickQuestion = async (questionType) => {
  const quickQuestions = {
    contract: "What are the essential elements of a valid contract under Kenyan law?",
    employment: "What are my rights as an employee under the Employment Act 2007?",
    constitutional: "What are the fundamental rights protected under Kenya's Constitution 2010?",
    criminal: "What are the steps in the criminal justice process in Kenya?",
    family: "What are the legal requirements for marriage in Kenya under the Marriage Act 2014?",
    commercial: "What are the legal requirements for incorporating a company in Kenya?",
    land: "What documents do I need for a valid land transaction in Kenya?"
  };
  
  const question = quickQuestions[questionType];
  if (question) {
    // Set the input and trigger send
    setInputValue(question);
    setSelectedLegalArea(questionType);
    
    // Auto-send the message
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  }
};

// Function to get available legal areas from API
const fetchLegalAreas = async () => {
  try {
    const res = await fetch("http://localhost:8000/legal/legal-areas");
    const data = await res.json();
    return data.legal_areas;
  } catch (err) {
    console.error("Error fetching legal areas:", err);
    return ["general", "contract_law", "employment_law", "constitutional", "criminal_law"];
  }
};

// Date range helper for research queries
const getDateRange = () => {
  // Return last 5 years by default
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 5);
  
  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0]
  };
};



  const handleQuickPrompt = (prompt: string) => {
    const quickMessage: Message = {
      id: Date.now().toString(),
      type: "quick-question",
      content: prompt,
      timestamp: new Date(),
      legalArea: false,
      isError: "",
      searchType: undefined,
      disclaimer: false
    };
    setMessages((prev) => [...prev, quickMessage]);
    setInputValue(prompt);
    setShowQuickQuestions(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header with Navigation Buttons */}
      <header className="bg-card border-b border-border shadow-sm lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Gavel className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-foreground">Kenya Legal AI</h1>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsProjectsMenuOpen(!isProjectsMenuOpen)}
            className="relative"
          >
            <FolderOpen className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] lg:h-screen relative">
        {/* Mobile Overlay */}
        {(isMobileMenuOpen || isProjectsMenuOpen) && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsProjectsMenuOpen(false);
            }}
          />
        )}

        {/* Main Sidebar */}
        <div className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:relative z-50 w-72 h-full
          transition-transform duration-300 ease-in-out lg:transition-none
        `}>
          <Sidebar />
        </div>

        {/* Main content */}
       <div className="flex flex-col h-full flex-1">
  {/* Legal Area Selector - New Addition */}
  <div className="flex-shrink-0 bg-card border-b px-2 sm:px-4 py-2">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          Legal Area:
        </span>
        <Select value={selectedLegalArea} onValueChange={setSelectedLegalArea}>
          <SelectTrigger className="w-auto h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Law</SelectItem>
            <SelectItem value="constitutional">Constitutional Law</SelectItem>
            <SelectItem value="contract_law">Contract Law</SelectItem>
            <SelectItem value="employment_law">Employment Law</SelectItem>
            <SelectItem value="criminal_law">Criminal Law</SelectItem>
            <SelectItem value="family_law">Family Law</SelectItem>
            <SelectItem value="commercial_law">Commercial Law</SelectItem>
            <SelectItem value="land_law">Land Law</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLegalResearch(inputValue, "case_law")}
            className="h-7 px-2 text-xs"
            disabled={!inputValue.trim()}
          >
            <Search className="h-3 w-3 mr-1" />
            Research
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLegalSettings(!showLegalSettings)}
            className="h-7 px-2"
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Legal Settings Panel */}
      {showLegalSettings && (
        <div className="mt-2 p-3 bg-muted/50 rounded-lg border space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium mb-1">Case Preference:</label>
              <Select value={casePreference} onValueChange={setCasePreference}>
                <SelectTrigger className="h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent Cases</SelectItem>
                  <SelectItem value="landmark">Landmark Cases</SelectItem>
                  <SelectItem value="all">All Cases</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block font-medium mb-1">Citation Level:</label>
              <Select value={citationLevel} onValueChange={setCitationLevel}>
                <SelectTrigger className="h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Basic</SelectItem>
                  <SelectItem value="medium">Standard</SelectItem>
                  <SelectItem value="high">Comprehensive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Chat messages container */}
  <div className="flex-1 flex flex-col overflow-hidden bg-muted/30">
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 pb-2 min-h-0"
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.type === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.type === "assistant" && (
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 h-fit">
                <Scale className="h-4 w-4 text-primary" />
              </div>
            )}

            <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
              <Card
                className={cn(
                  "p-3",
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.type === "quick-question"
                    ? "bg-accent border-accent-foreground/10"
                    : "bg-card border",
                  message.isError && "border-destructive/50 bg-destructive/5"
                )}
              >
                <CardContent className="p-0">
                  {/* Legal Area Badge for Assistant Messages */}
                  {message.type === "assistant" && typeof message.legalArea === "string" && message.legalArea !== "general" && (
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {typeof message.legalArea === "string"
                          ? message.legalArea.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                          : ""}
                      </Badge>
                    </div>
                  )}
                  
                  <p
                    className={cn(
                      "text-sm leading-relaxed break-words",
                      message.type === "user"
                        ? "text-primary-foreground"
                        : "text-card-foreground"
                    )}
                  >
                    {message.content}
                  </p>

                  {/* Research Badge */}
                  {message.isResearch && (
                    <div className="mt-2 flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        <Search className="h-2 w-2 mr-1" />
                        Legal Research: {message.searchType?.replace('_', ' ')}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Citations Display */}
              {message.type === "assistant" && message.citations && (
  <div className="space-y-2 text-xs text-muted-foreground">
    <div className="flex items-center gap-2 flex-wrap">
      <FileText className="h-3 w-3 flex-shrink-0" />
      <span className="break-words">
        Sources:{" "}
        {message.citations.map((c: any, idx: number) =>
          typeof c === "string" ? c : c.citation
        ).join(", ")}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          copyToClipboard(
            message.citations
              .map((c: any) => (typeof c === "string" ? c : c.citation))
              .join(", ")
          )
        }
        className="h-4 w-4 p-0 flex-shrink-0"
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  </div>
)}


              {/* Legal Disclaimer */}
              {message.type === "assistant" && message.disclaimer && (
                <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2 border">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5 text-yellow-600" />
                    <span>{message.disclaimer}</span>
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "text-xs text-muted-foreground flex items-center gap-2",
                  message.type === "user" ? "justify-end" : "justify-start"
                )}
              >
                <span>{message.timestamp.toLocaleTimeString()}</span>
                {message.type === "assistant" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(message.content)}
                    className="h-4 w-4 p-0"
                  >
                    <Copy className="h-2.5 w-2.5" />
                  </Button>
                )}
              </div>
            </div>

            {message.type === "user" && (
              <div className="p-2 bg-muted rounded-lg flex-shrink-0 h-fit">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {/* Enhanced Quick Questions */}
        {showQuickQuestions && (
          <div className="flex justify-start">
            <div className="max-w-[85%] sm:max-w-[75%] space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Scale className="h-4 w-4 text-primary" />
                <span className="font-medium">Legal Quick Start</span>
              </div>
              
              {/* Legal Area Quick Questions */}
              <div className="space-y-3">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Popular Legal Questions:
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {getLegalQuickPrompts(selectedLegalArea).map((prompt, idx) => (
                    <Card
                      key={idx}
                      className="cursor-pointer hover:shadow-md transition-all border hover:border-primary/20 hover:bg-primary/5"
                      onClick={() => handleQuickPrompt(prompt.question)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {prompt.area}
                          </Badge>
                          <p className="text-sm text-card-foreground leading-relaxed">
                            {prompt.question}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Sample Legal Documents */}
                <div className="text-xs font-medium text-muted-foreground mb-2 mt-4">
                  Need help with documents?
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: FileText, label: "Contract Review", action: "contract_review" },
                    { icon: Briefcase, label: "Employment Issues", action: "employment" },
                    { icon: Home, label: "Property Law", action: "land_law" },
                    { icon: Gavel, label: "Court Procedures", action: "procedure" }
                  ].map((item, idx) => (
                    <Card
                      key={idx}
                      className="cursor-pointer hover:shadow-sm transition-all border hover:border-primary/20 p-2"
                      onClick={() => handleDocumentAssistance(item.action)}
                    >
                      <div className="flex flex-col items-center text-center space-y-1">
                        <item.icon className="h-4 w-4 text-primary" />
                        <span className="text-xs">{item.label}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Scale className="h-4 w-4 text-primary" />
            </div>
            <Card className="bg-card border">
              <CardContent className="p-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Analyzing Kenyan legal precedents...
                </span>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  </div>

  {/* Enhanced Input area */}
    <div className="max-w-4xl mx-auto p-3 sm:p-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask about in Kenya...`}
              className="text-sm min-w-0 pr-20"
              disabled={isLoading}
            />
            {/* Voice Input Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setShowVoiceInput(!showVoiceInput)}
            >
              <Mic className="h-3 w-3" />
            </Button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Legal Input Helpers */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Scale className="h-3 w-3" />
            <span>Kenya Legal AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Powered by GPT • Free Research</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMessages([])}
              className="h-5 px-1 text-xs"
            >
              Clear Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>

        {/* Projects Sidebar */}
        <div className={`
          ${isProjectsMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:translate-x-0 fixed lg:relative z-50 right-0 w-72 h-full
          transition-transform duration-300 ease-in-out lg:transition-none
        `}>
          <ProjectsSidebar/>
        </div>
      </div>
    </div>
  );
};

export default Index;
// Remove this unused function, as setSelectedLegalArea is now a state setter from useState.

