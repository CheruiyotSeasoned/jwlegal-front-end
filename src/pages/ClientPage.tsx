import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import remarkGfm from "remark-gfm";
import { ProjectsSidebar } from "@/components/ProjectSidebar";
import Logo from "@/assets/yellow-blue-removebg-preview.png"; // Ensure you have a logo image at this path
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
  MessageSquare,
  FileSearch,
  History,
  Star,
  Archive,
  Plus,
  X,
  Square,
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

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  legalArea?: string;
  isActive: boolean;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  type: 'chat' | 'research' | 'documents' | 'history' | 'favorites';
  description?: string;
  badge?: string;
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

// Navigation items configuration
const navigationItems: NavigationItem[] = [
  {
    id: 'new-chat',
    label: 'New Chat',
    icon: MessageSquare,
    type: 'chat',
    description: 'Start a new legal consultation'
  },
  {
    id: 'research',
    label: 'Legal Research',
    icon: FileSearch,
    type: 'research',
    description: 'Deep dive into case law and statutes'
  },
  {
    id: 'documents',
    label: 'Document Review',
    icon: FileText,
    type: 'documents',
    description: 'Analyze legal documents'
  },
  {
    id: 'history',
    label: 'Chat History',
    icon: History,
    type: 'history',
    description: 'View previous consultations'
  },
  {
    id: 'favorites',
    label: 'Saved Queries',
    icon: Star,
    type: 'favorites',
    description: 'Quick access to saved legal queries'
  }
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
  const [activeNavItem, setActiveNavItem] = useState('new-chat');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'default',
      title: 'New Legal Consultation',
      messages: [{
        id: "1",
        type: "assistant",
        content: "Hello! I'm your AI Legal Research Assistant. I can help you with Kenyan law research, case analysis, legal document review, and more. What legal question can I help you with today?",
        timestamp: new Date(),
        legalArea: false,
        isError: "",
        searchType: undefined,
        disclaimer: false
      }],
      timestamp: new Date(),
      isActive: true
    }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState('default');
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [selectedLegalArea, setSelectedLegalArea] = useState<string>('general');
  const [citationLevel, setCitationLevel] = useState<string>("medium");
  const [casePreference, setCasePreference] = useState<string>("recent");
  const [savedQueries, setSavedQueries] = useState<any[]>([]);
  const [researchResults, setResearchResults] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showLegalSettings, setShowLegalSettings] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  // Get current session
  const currentSession = chatSessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordTime, setRecordTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  // const recordIntervalRef = useRef<NodeJS.Timer | null>(null);
  const recordIntervalRef = useRef<number | null>(null);

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

  // Handle navigation item clicks
  const handleNavItemClick = (itemId: string) => {
    setActiveNavItem(itemId);
    setIsMobileMenuOpen(false);

    switch (itemId) {
      case 'new-chat':
        createNewChatSession();
        break;
      case 'research':
        setShowQuickQuestions(false);
        // Could show research interface
        break;
      case 'documents':
        setShowQuickQuestions(false);
        // Could show document upload interface
        break;
      case 'history':
        // Show chat history
        break;
      case 'favorites':
        // Show saved queries
        break;
      default:
        break;
    }
  };

  // Create new chat session
  const createNewChatSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Legal Consultation',
      messages: [{
        id: Date.now().toString(),
        type: "assistant",
        content: "Hello! I'm your AI Legal Research Assistant. How can I help you with Kenyan law today?",
        timestamp: new Date(),
        legalArea: false,
        isError: "",
        searchType: undefined,
        disclaimer: false
      }],
      timestamp: new Date(),
      isActive: true
    };

    setChatSessions(prev => {
      const updated = prev.map(s => ({ ...s, isActive: false }));
      return [...updated, newSession];
    });
    setCurrentSessionId(newSession.id);
    setShowQuickQuestions(true);
  };

  // Switch to existing session
  const switchToSession = (sessionId: string) => {
    setChatSessions(prev => prev.map(s => ({
      ...s,
      isActive: s.id === sessionId
    })));
    setCurrentSessionId(sessionId);
  };

  // Delete session
  const deleteSession = (sessionId: string) => {
    if (chatSessions.length <= 1) return; // Don't delete last session

    setChatSessions(prev => prev.filter(s => s.id !== sessionId));

    if (sessionId === currentSessionId) {
      const remainingSessions = chatSessions.filter(s => s.id !== sessionId);
      const newActiveSession = remainingSessions[0];
      setCurrentSessionId(newActiveSession.id);
    }
  };

  // Update current session messages
  const updateCurrentSession = (newMessages: Message[]) => {
    setChatSessions(prev => prev.map(session =>
      session.id === currentSessionId
        ? { ...session, messages: newMessages, timestamp: new Date() }
        : session
    ));
  };

  // Enhanced legal chat handler
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

    const newMessages = [...messages, userMessage];
    updateCurrentSession(newMessages);
    setInputValue("");
    setIsLoading(true);
    setShowQuickQuestions(false);

    // Update session title based on first user message
    if (messages.length <= 1) {
      const title = inputValue.length > 50 ? inputValue.substring(0, 50) + '...' : inputValue;
      setChatSessions(prev => prev.map(session =>
        session.id === currentSessionId
          ? { ...session, title }
          : session
      ));
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${API_BASE_URL}/legal/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/plain",
        },
        body: JSON.stringify({
          message: userMessage.content,
          legal_area: selectedLegalArea || "general",
          case_preference: casePreference || "recent",
          citation_level: citationLevel || "medium",
          context_history: getConversationHistory(),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const aiMessageId = (Date.now() + 1).toString();
      let accumulatedText = "";

      const initialAiMessage: Message = {
        id: aiMessageId,
        type: "assistant",
        content: "",
        timestamp: new Date(),
        legalArea: false,
        isError: "",
        searchType: undefined,
        disclaimer: false,
      };

      updateCurrentSession([...newMessages, initialAiMessage]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulatedText += decoder.decode(value, { stream: true });

        // Update current session with streaming content
        setChatSessions(prev => prev.map(session =>
          session.id === currentSessionId
            ? {
              ...session,
              messages: session.messages.map(msg =>
                msg.id === aiMessageId
                  ? { ...msg, content: accumulatedText }
                  : msg
              )
            }
            : session
        ));
      }

      // Final update with citations and confidence
      setChatSessions(prev => prev.map(session =>
        session.id === currentSessionId
          ? {
            ...session,
            messages: session.messages.map(msg =>
              msg.id === aiMessageId
                ? {
                  ...msg,
                  content: accumulatedText,
                  citations: extractCitations(accumulatedText),
                  confidence: calculateConfidence(accumulatedText, selectedLegalArea),
                }
                : msg
            )
          }
          : session
      ));

    } catch (err: any) {
      console.error("Legal chat error:", err);

      const errorResponse: Message = {
        id: (Date.now() + 2).toString(),
        type: "assistant",
        content: `I apologize, but I'm having trouble connecting to the legal research service. ${err.message || "Please try again in a moment."}`,
        timestamp: new Date(),
        legalArea: false,
        isError: "",
        searchType: undefined,
        disclaimer: false
      };
      updateCurrentSession([...newMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions (keeping your existing ones)
  const getConversationHistory = () => {
    const recentMessages = messages.slice(-4).map(msg => ({
      role: msg.type === "user" ? "user" : "assistant",
      content: msg.content
    }));

    return recentMessages;
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
    updateCurrentSession([...messages, quickMessage]);
    setInputValue(prompt);
    setShowQuickQuestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleToggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      if (recordIntervalRef.current) {
        clearInterval(recordIntervalRef.current);
        recordIntervalRef.current = null;
      }
      setRecordTime(0);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const audioUrl = URL.createObjectURL(blob);
          setAudioURL(audioUrl);

          // Send to transcription API
          const formData = new FormData();
          formData.append("file", blob, "recording.webm");

          setIsLoading(true);
          try {
            const res = await fetch(
              "https://legalbuddyapi.aiota.online/legal/api/transcribe",
              {
                method: "POST",
                body: formData,
              }
            );
            const data = await res.json();

            if (data.text) {
              setInputValue(data.text);
              // Clean up audio after successful transcription
              URL.revokeObjectURL(audioUrl);
              setAudioURL(null);
            }
          } catch (err) {
            console.error("Transcription error:", err);
          } finally {
            setIsLoading(false);
            // Clean up media stream
            stream.getTracks().forEach(track => track.stop());
          }
        };

        mediaRecorder.start();
        setIsRecording(true);

        // Start record timer
        recordIntervalRef.current = window.setInterval(() => {
          setRecordTime((prev) => prev + 1);
        }, 1000);

      } catch (err) {
        console.error("Microphone access denied:", err);
      }
    }
  };
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      if (recordIntervalRef.current) {
        clearInterval(recordIntervalRef.current);
      }
    };
  }, [audioURL]);


  // Render content based on active navigation item
  const renderMainContent = () => {
    switch (activeNavItem) {
      case 'history':
        return renderChatHistory();
      case 'favorites':
        return renderSavedQueries();
      case 'research':
        return renderResearchInterface();
      case 'documents':
        return renderDocumentInterface();
      default:
        return renderChatInterface();
    }
  };

  const renderChatHistory = () => (
    <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <Button
            onClick={() => handleNavItemClick('new-chat')}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="grid gap-3">
          {chatSessions.map((session) => (
            <Card
              key={session.id}
              className={cn(
                "cursor-pointer hover:shadow-md transition-all",
                session.isActive && "border-primary bg-primary/5"
              )}
              onClick={() => {
                switchToSession(session.id);
                handleNavItemClick('new-chat');
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium truncate">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {session.messages.length} messages • {session.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.legalArea && (
                      <Badge variant="outline" className="text-xs">
                        {session.legalArea}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSavedQueries = () => (
    <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-lg font-semibold">Saved Legal Queries</h2>

        {savedQueries.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No saved queries yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Save frequently used legal queries for quick access
              </p>
              <Button
                onClick={() => handleNavItemClick('new-chat')}
                variant="outline"
              >
                Start New Chat
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {savedQueries.map((query, idx) => (
              <Card key={idx} className="cursor-pointer hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{query.title}</h3>
                      <p className="text-sm text-muted-foreground">{query.preview}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderResearchInterface = () => (
    <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-lg font-semibold">Legal Research</h2>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Research Type</label>
                  <Select defaultValue="case_law">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="case_law">Case Law</SelectItem>
                      <SelectItem value="statutes">Statutes</SelectItem>
                      <SelectItem value="regulations">Regulations</SelectItem>
                      <SelectItem value="all">All Sources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Jurisdiction</label>
                  <Select defaultValue="kenya">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kenya">Kenya</SelectItem>
                      <SelectItem value="east_africa">East Africa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Research Query</label>
                <TextareaAutosize
                  placeholder="Enter your legal research query..."
                  className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm"
                  minRows={3}
                />
              </div>

              <Button className="w-full">
                <FileSearch className="h-4 w-4 mr-2" />
                Start Research
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Research results would go here */}
        <div className="text-center text-muted-foreground py-8">
          Research results will appear here after you submit a query
        </div>
      </div>
    </div>
  );

  const renderDocumentInterface = () => (
    <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-lg font-semibold">Document Review</h2>

        <Card>
          <CardContent className="p-6 text-center border-2 border-dashed border-muted-foreground/25">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Upload Legal Document</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload contracts, legal briefs, or other documents for AI analysis
            </p>
            <Button variant="outline">
              Choose File
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Contract Analysis</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Review contract terms, identify risks, and get compliance insights
              </p>
              <Button variant="outline" size="sm">
                Analyze Contract
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Legal Brief Review</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Check legal arguments, citation accuracy, and writing quality
              </p>
              <Button variant="outline" size="sm">
                Review Brief
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderChatInterface = () => (
    <>
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
                      {message.type === "assistant" && typeof message.legalArea === "string" && message.legalArea !== "general" && (
                        <div className="mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {typeof message.legalArea === "string"
                              ? message.legalArea.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                              : ""}
                          </Badge>
                        </div>
                      )}

                      <div
                        className={cn(
                          "prose prose-sm max-w-none",
                          message.type === "user"
                            ? "text-primary-foreground"
                            : "text-card-foreground"
                        )}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>

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
                              message.content
                            )
                          }
                          className="h-4 w-4 p-0 flex-shrink-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

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

                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground mb-2">
                      Popular Legal Questions:
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {quickPrompts.map((prompt, idx) => (
                        <Card
                          key={idx}
                          className="cursor-pointer hover:shadow-md transition-all border hover:border-primary/20 hover:bg-primary/5"
                          onClick={() => handleQuickPrompt(prompt)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-2">
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                Legal
                              </Badge>
                              <p className="text-sm text-card-foreground leading-relaxed">
                                {prompt}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

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
                          onClick={() =>
                            handleDocumentAssistance(item.action, setInputValue, setSelectedLegalArea)
                          }
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
      <div className="max-w-4xl p-2 sm:p-3 md:p-4">
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <div className="relative flex-1 min-w-0">
              <TextareaAutosize
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Get legal help in Kenya..."
                disabled={isLoading}
                minRows={1}
                maxRows={6}
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 pr-12 sm:pr-10 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              />

              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                {isRecording && <span className="text-xs text-red-500">{recordTime}s</span>}

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleToggleRecording}
                >
                  {isRecording ? (
                    <Square className="h-3 w-3 text-red-500" />
                  ) : (
                    <Mic className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>

            {audioURL && (
              <div className="w-full sm:w-auto">
                <audio controls src={audioURL} className="w-full sm:w-auto" />
              </div>
            )}

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="flex-shrink-0 w-full sm:w-auto"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );

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

        {/* Enhanced Main Sidebar with Navigation */}
        <div className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:relative z-50 w-72 h-full
          transition-transform duration-300 ease-in-out lg:transition-none
          bg-card border-r
        `}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Gavel className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center space-x-2">
                  <Link to="/" className="flex flex-col items-start cursor-pointer">
                    <img
                      src={Logo}
                      alt="Legal Buddy Logo"
                      className="h-10 w-auto"
                    />
                    <span className="text-xs text-muted-foreground">
                      AI-Powered Legal Research
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeNavItem === item.id ? "secondary" : "ghost"}
                      className="w-full justify-start gap-3 h-auto py-3"
                      onClick={() => handleNavItemClick(item.id)}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.label}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        )}
                      </div>
                      {item.badge && (
                        <Badge variant="outline" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </nav>

              {/* Legal Categories */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Legal Areas
                </h3>
                <div className="space-y-1">
                  {legalCategories.slice(0, 6).map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 text-sm"
                        onClick={() => {
                          setSelectedLegalArea(category.id);
                          handleNavItemClick('new-chat');
                        }}
                      >
                        <Icon className="h-3 w-3" />
                        {category.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Sessions */}
              {activeNavItem !== 'history' && chatSessions.length > 1 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Recent Chats
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavItemClick('history')}
                      className="h-6 px-2 text-xs"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {chatSessions.slice(0, 3).map((session) => (
                      <Button
                        key={session.id}
                        variant={currentSessionId === session.id ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-sm truncate"
                        onClick={() => {
                          switchToSession(session.id);
                          handleNavItemClick('new-chat');
                        }}
                      >
                        <MessageSquare className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{session.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2 text-muted-foreground space-y-1">
                <div className="flex items-center justify-between">
                  <span>Session: {currentSession?.title?.substring(0, 20)}...</span>
                  <Badge variant="outline" className="text-xs">
                    {messages.length} msgs
                  </Badge>
                </div>
                <div>Legal area: {selectedLegalArea === 'general' ? 'General' : selectedLegalArea?.replace('_', ' ')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col h-full flex-1">
          {/* Legal Area Selector - Enhanced */}
          <div className="flex-shrink-0 bg-card border-b px-2 sm:px-4 py-2">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                  Legal Area:
                </span>
                <Select value={selectedLegalArea || 'general'} onValueChange={setSelectedLegalArea}>
                  <SelectTrigger className="w-auto h-7 text-xs">
                    <SelectValue placeholder="Select area" />
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
                  {activeNavItem === 'new-chat' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNavItemClick('research')}
                        className="h-7 px-2 text-xs"
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
                    </>
                  )}

                  {/* Navigation breadcrumb */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>/</span>
                    <span>{navigationItems.find(item => item.id === activeNavItem)?.label}</span>
                  </div>
                </div>
              </div>

              {/* Legal Settings Panel - Only show in chat mode */}
              {showLegalSettings && activeNavItem === 'new-chat' && (
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

          {/* Dynamic Main Content */}
          {renderMainContent()}
        </div>

        {/* Projects Sidebar - Enhanced */}
        <div className={`
          ${isProjectsMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:translate-x-0 fixed lg:relative z-50 right-0 w-72 h-full
          transition-transform duration-300 ease-in-out lg:transition-none
        `}>
          <ProjectsSidebar />
        </div>
      </div>
    </div>
  );
};


export default Index;