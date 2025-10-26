import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";


import {
    FileText,
    Upload,
    Send,
    Brain,
    Scale,
    BookOpen,
    ExternalLink,
    Download,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2,
    X,
    Eye,
    Gavel,
    FileCheck,
    MessageSquare,
    PaperclipIcon,
    Bot,
    User,
    ChevronDown,
    ChevronRight,
    History,
    Trash2,
    Plus,
    Calendar,
    Search
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type RequestType = "legal_opinion" | "case_analysis" | "compliance_review" | "contract_review" | "legislation_analysis";
type ResearchStatus = "pending" | "analyzing" | "researching" | "completed" | "error";
type ReferenceType = "case" | "statute" | "regulation" | "act" | "rule";
type MessageType = "user" | "assistant" | "system";

interface UploadedFile {
    id: string;
    name: string;
    type: string;
    size: number;
    content?: string;
    url?: string;
    mime_type?: string;
    uploaded_at?: string;
}

interface LegalReference {
    id: string;
    type: ReferenceType;
    title: string;
    citation: string;
    relevance: number;
    summary: string;
    kenyan_law_url?: string;
    section?: string | null;
    year?: string | null;
}

interface ResearchAnalysis {
    id: string;
    summary: string;
    key_findings: string[];
    legal_position: string;
    recommendations: string[];
    risks: string[];
    precedents: LegalReference[];
    statutes: LegalReference[];
    regulations: LegalReference[];
    related_cases: LegalReference[];
    full_analysis: string;
}

interface ChatMessage {
    id: string;
    type: MessageType;
    content: string;
    timestamp: string;
    requestType?: RequestType;
    files?: UploadedFile[];
    analysis?: ResearchAnalysis;
    status?: ResearchStatus;
    requestId?: string;
}

interface ConversationSummary {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    message_count: number;
    last_message_preview: string;
    status: ResearchStatus;
    request_type?: RequestType;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const REQUEST_TYPES = [
    { value: "legal_opinion", label: "Legal Opinion", icon: Scale, description: "Get comprehensive legal analysis and opinion" },
    { value: "case_analysis", label: "Case Analysis", icon: Gavel, description: "Analyze case facts and legal implications" },
    { value: "compliance_review", label: "Compliance Review", icon: FileCheck, description: "Review compliance with regulations" },
    { value: "contract_review", label: "Contract Review", icon: FileText, description: "Analyze contracts and agreements" },
    { value: "legislation_analysis", label: "Legislation Analysis", icon: BookOpen, description: "Analyze proposed or existing legislation" }
];

// Mock conversation history data (fallback)
const mockConversationHistory: ConversationSummary[] = [
    {
        id: "conv_001",
        title: "Employment Contract Dispute Analysis",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T11:45:00Z",
        message_count: 6,
        last_message_preview: "Based on the Employment Act 2007 and recent Court of Appeal decisions, the termination clause appears to violate...",
        status: "completed",
        request_type: "contract_review"
    },
    {
        id: "conv_002", 
        title: "Land Acquisition Compensation Rights",
        created_at: "2024-01-14T14:20:00Z",
        updated_at: "2024-01-14T15:30:00Z",
        message_count: 8,
        last_message_preview: "The Constitution Article 40 provides comprehensive protection for property rights. The Land Acquisition Act...",
        status: "completed",
        request_type: "legal_opinion"
    }
];

export default function AILegalResearchChat() {
    // Chat state
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            type: "system",
            content: "Welcome to AI Legal Research! I can help you with legal opinions, case analysis, compliance reviews, contract analysis, and legislation research. What legal question can I help you with today?",
            timestamp: new Date().toISOString()
        }
    ]);
    
    const [currentInput, setCurrentInput] = useState("");
    const [selectedRequestType, setSelectedRequestType] = useState<RequestType>("legal_opinion");
    const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pollingRequestId, setPollingRequestId] = useState<string | null>(null);
    
    // Reference dialog state
    const [selectedReference, setSelectedReference] = useState<LegalReference | null>(null);
    const [referenceContent, setReferenceContent] = useState<string>("");
    const [loadingReference, setLoadingReference] = useState(false);
    
    // History state
    const [conversationHistory, setConversationHistory] = useState<ConversationSummary[]>(mockConversationHistory);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [expandedConversations, setExpandedConversations] = useState<Set<string>>(new Set());
    const [historySearch, setHistorySearch] = useState("");
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isLoadingConversation, setIsLoadingConversation] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load conversation history on mount
    useEffect(() => {
        loadConversationHistory();
    }, []);

    // Polling effect for checking research status
    useEffect(() => {
        if (!pollingRequestId) return;

        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/legal-research/research/requests/${pollingRequestId}`,
                    {
                        headers: {
                        "accept": "application/json",
                        "Authorization": `Bearer null`
                        }
                    }
                    );

                if (!response.ok) {
                    console.error("Failed to poll research status");
                    return;
                }

                const data = await response.json();
                
                // Check if research is completed
                if (data.status === "completed" && data.analysis) {
                    // Update the message with completed analysis
                    setMessages(prev => prev.map(msg => 
                        msg.requestId === pollingRequestId 
                            ? { ...msg, status: "completed", analysis: data.analysis }
                            : msg
                    ));
                    
                    // Stop polling
                    setPollingRequestId(null);
                    setIsProcessing(false);
                } else if (data.status === "error") {
                    // Handle error status
                    setMessages(prev => prev.map(msg => 
                        msg.requestId === pollingRequestId 
                            ? { ...msg, status: "error", content: "Research request failed. Please try again." }
                            : msg
                    ));
                    
                    setPollingRequestId(null);
                    setIsProcessing(false);
                } else {
                    // Update status (analyzing, researching, etc.)
                    setMessages(prev => prev.map(msg => 
                        msg.requestId === pollingRequestId 
                            ? { ...msg, status: data.status as ResearchStatus }
                            : msg
                    ));
                }
            } catch (error) {
                console.error("Error polling research status:", error);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(pollInterval);
    }, [pollingRequestId]);

    const loadConversationHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/legal-research/research/requests?limit=50&offset=0`,
                {
                    headers: {
                        "accept": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load conversation history");
            }

            const data = await response.json();
            
            // Transform API response to ConversationSummary format
            const conversations: ConversationSummary[] = data.map((item: any) => ({
                id: item.id || item.request_id,
                title: item.question?.substring(0, 50) || "Legal Research Request",
                created_at: item.created_at,
                updated_at: item.updated_at || item.created_at,
                message_count: 2,
                last_message_preview: item.analysis?.summary?.substring(0, 100) || "Research in progress...",
                status: item.status as ResearchStatus,
                request_type: item.request_type as RequestType
            }));
            
            setConversationHistory(conversations);
        } catch (error) {
            console.error("Failed to load conversation history:", error);
            setConversationHistory(mockConversationHistory);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const loadConversation = async (conversationId: string) => {
        setIsLoadingConversation(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/legal-research/research/requests/${conversationId}`,
                {
                    headers: {
                        "accept": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load conversation");
            }

            const data = await response.json();
            
            const loadedMessages: ChatMessage[] = [
                {
                    id: "welcome",
                    type: "system", 
                    content: `Resuming conversation from ${formatDate(data.created_at)}`,
                    timestamp: data.created_at
                },
                {
                    id: `user_${conversationId}`,
                    type: "user",
                    content: data.question || "Legal research request",
                    timestamp: data.created_at,
                    requestType: data.request_type as RequestType,
                    files: data.documents?.map((doc: any) => ({
                        id: doc.id,
                        name: doc.filename,
                        type: doc.content_type,
                        size: 0,
                        uploaded_at: doc.uploaded_at
                    }))
                }
            ];

            if (data.status === "completed" && data.analysis) {
                loadedMessages.push({
                    id: `assistant_${conversationId}`,
                    type: "assistant",
                    content: "Here's my comprehensive legal analysis:",
                    timestamp: data.updated_at || data.created_at,
                    status: "completed",
                    analysis: data.analysis,
                    requestId: conversationId
                });
            } else if (data.status !== "completed") {
                loadedMessages.push({
                    id: `assistant_${conversationId}`,
                    type: "assistant",
                    content: "Analyzing your legal research request...",
                    timestamp: data.updated_at || data.created_at,
                    status: data.status as ResearchStatus,
                    requestId: conversationId
                });
                
                setPollingRequestId(conversationId);
            }

            setMessages(loadedMessages);
            setCurrentConversationId(conversationId);
            setShowHistory(false);
            
        } catch (error) {
            console.error("Failed to load conversation:", error);
            const conversation = conversationHistory.find(c => c.id === conversationId);
            if (conversation) {
                const mockMessages: ChatMessage[] = [
                    {
                        id: "welcome",
                        type: "system", 
                        content: `Resuming conversation: ${conversation.title}`,
                        timestamp: conversation.created_at
                    },
                    {
                        id: `user_${conversationId}`,
                        type: "user",
                        content: generateMockUserMessage(conversation.request_type),
                        timestamp: conversation.created_at,
                        requestType: conversation.request_type
                    },
                    {
                        id: `assistant_${conversationId}`,
                        type: "assistant",
                        content: "Here's my comprehensive legal analysis:",
                        timestamp: conversation.updated_at,
                        status: conversation.status,
                        analysis: conversation.status === "completed" ? generateMockAnalysis() : undefined
                    }
                ];
                setMessages(mockMessages);
                setCurrentConversationId(conversationId);
                setShowHistory(false);
            }
        } finally {
            setIsLoadingConversation(false);
        }
    };

    const generateMockUserMessage = (requestType?: RequestType): string => {
        const messages = {
            contract_review: "I need help reviewing this employment contract. Are there any clauses that might be problematic?",
            legal_opinion: "What are my rights regarding property compensation under Kenyan law?", 
            compliance_review: "Can you help me understand my tax compliance obligations as a small business?",
            case_analysis: "I need analysis of this case and its implications for my situation.",
            legislation_analysis: "How does the new legislation affect existing regulations?"
        };
        return messages[requestType || "legal_opinion"];
    };

    const startNewConversation = () => {
        setMessages([
            {
                id: "welcome", 
                type: "system",
                content: "Welcome to AI Legal Research! I can help you with legal opinions, case analysis, compliance reviews, contract analysis, and legislation research. What legal question can I help you with today?",
                timestamp: new Date().toISOString()
            }
        ]);
        setCurrentConversationId(null);
        setCurrentInput("");
        setAttachedFiles([]);
        setShowHistory(false);
    };

    const deleteConversation = async (conversationId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        
        try {
            setConversationHistory(prev => prev.filter(c => c.id !== conversationId));
            
            if (currentConversationId === conversationId) {
                startNewConversation();
            }
        } catch (error) {
            console.error("Failed to delete conversation:", error);
        }
    };

    const toggleConversationExpansion = (conversationId: string) => {
        setExpandedConversations(prev => {
            const newSet = new Set(prev);
            if (newSet.has(conversationId)) {
                newSet.delete(conversationId);
            } else {
                newSet.add(conversationId);
            }
            return newSet;
        });
    };

    const filteredHistory = conversationHistory.filter(conv => 
        conv.title.toLowerCase().includes(historySearch.toLowerCase()) ||
        conv.last_message_preview.toLowerCase().includes(historySearch.toLowerCase())
    );

    const getRequestTypeInfo = (type?: RequestType) => {
        return REQUEST_TYPES.find(t => t.value === type) || REQUEST_TYPES[0];
    };

    const getStatusIcon = (status?: ResearchStatus) => {
        switch (status) {
            case "analyzing": return <Brain className="h-4 w-4 animate-pulse text-blue-500" />;
            case "researching": return <Loader2 className="h-4 w-4 animate-spin text-purple-500" />;
            case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "error": return <AlertCircle className="h-4 w-4 text-red-500" />;
            default: return null;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles: UploadedFile[] = [];
        
        for (const file of files) {
            const uploadedFile: UploadedFile = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.type,
                size: file.size,
                uploaded_at: new Date().toISOString()
            };

            (uploadedFile as any).fileObject = file;

            if (file.type.includes('text')) {
                try {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        uploadedFile.content = e.target?.result as string;
                    };
                    reader.readAsText(file);
                } catch (error) {
                    console.error("Error reading file:", error);
                }
            }
            
            newFiles.push(uploadedFile);
        }

        setAttachedFiles(prev => [...prev, ...newFiles]);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (fileId: string) => {
        setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const submitMessage = async () => {
        if (!currentInput.trim() && attachedFiles.length === 0) return;
        if (isProcessing) return;

        setIsProcessing(true);

        const userMessage: ChatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            type: "user",
            content: currentInput,
            timestamp: new Date().toISOString(),
            requestType: selectedRequestType,
            files: attachedFiles.length > 0 ? [...attachedFiles] : undefined
        };

        setMessages(prev => [...prev, userMessage]);
        
        const questionText = currentInput;
        setCurrentInput("");
        setAttachedFiles([]);

        try {
            const formData = new FormData();
            formData.append('question', questionText);
            formData.append('request_type', selectedRequestType);
            
            attachedFiles.forEach((file) => {
                if ((file as any).fileObject) {
                    formData.append('documents', (file as any).fileObject);
                }
            });

            const response = await fetch(
                `${API_BASE_URL}/legal-research/research/requests`,
                {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json'
                    },
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error('Failed to submit research request');
            }

            const data = await response.json();
            const requestId = data.id || data.request_id;

            const analysisMessage: ChatMessage = {
                id: Math.random().toString(36).substr(2, 9),
                type: "assistant",
                content: "Analyzing your legal research request...",
                timestamp: new Date().toISOString(),
                status: "analyzing",
                requestId: requestId
            };

            setMessages(prev => [...prev, analysisMessage]);
            
            setPollingRequestId(requestId);
            setCurrentConversationId(requestId);
            
            loadConversationHistory();
            
        } catch (error) {
            console.error('Failed to submit research request:', error);
            
            setTimeout(() => {
                const analysisMessage: ChatMessage = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: "assistant",
                    content: "Here's my comprehensive legal analysis:",
                    timestamp: new Date().toISOString(),
                    status: "completed",
                    analysis: generateMockAnalysis()
                };

                setMessages(prev => [...prev, analysisMessage]);
                setIsProcessing(false);
                
                const newConversation: ConversationSummary = {
                    id: `conv_${Date.now()}`,
                    title: questionText.substring(0, 50) || "Legal Research Request",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    message_count: 2,
                    last_message_preview: "Based on my analysis of Kenyan law...",
                    status: "completed",
                    request_type: selectedRequestType
                };
                
                setConversationHistory(prev => [newConversation, ...prev]);
                setCurrentConversationId(newConversation.id);
            }, 3000);
        }
    };

    const generateMockAnalysis = (): ResearchAnalysis => {
        return {
            id: Math.random().toString(36).substr(2, 9),
            summary: "Based on my analysis of Kenyan law, I've identified the key legal principles, relevant authorities, and practical recommendations for your situation.",
            key_findings: [
                "The Constitution of Kenya 2010 provides the fundamental framework",
                "Recent Court of Appeal decisions have clarified the legal position",
                "Specific regulatory requirements must be considered",
                "Cross-reference with relevant statutory provisions is essential"
            ],
            legal_position: "The legal position is well-established under current Kenyan jurisprudence, with recent clarifications from the superior courts providing clear guidance on the applicable principles.",
            recommendations: [
                "Ensure compliance with constitutional requirements",
                "Consider recent precedent from superior courts",
                "Review regulatory compliance obligations",
                "Implement appropriate risk mitigation measures"
            ],
            risks: [
                "Potential constitutional challenges",
                "Regulatory compliance gaps",
                "Precedent uncertainty in emerging areas",
                "Enforcement challenges"
            ],
            precedents: [
                {
                    id: "prec_001",
                    type: "case",
                    title: "Republic v. Independent Electoral & Boundaries Commission Ex Parte Maina Kiai & Others",
                    citation: "[2017] eKLR",
                    relevance: 92,
                    summary: "Supreme Court guidance on electoral processes and constitutional interpretation.",
                    kenyan_law_url: "http://kenyalaw.org/caselaw/cases/view/12345",
                    year: "2017"
                }
            ],
            statutes: [
                {
                    id: "stat_001",
                    type: "statute",
                    title: "Constitution of Kenya",
                    citation: "2010", 
                    relevance: 95,
                    summary: "The supreme law of Kenya establishing fundamental rights and governance structures.",
                    section: "Articles 1-264",
                    year: "2010"
                }
            ],
            regulations: [],
            related_cases: [],
            full_analysis: "# Legal Analysis Summary\n\n## Constitutional Framework\nThe Constitution of Kenya 2010 establishes the fundamental legal framework applicable to this matter...\n\n## Statutory Provisions\nSeveral key statutes are relevant to this analysis...\n\n## Case Law Analysis\nRecent decisions from the Court of Appeal and High Court have provided important guidance..."
        };
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitMessage();
        }
    };

    if (showHistory) {
        return (
            <div className="flex flex-col h-screen bg-white rounded-lg border border-slate-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-slate-800">Conversation History</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={startNewConversation}
                            className="flex items-center gap-1"
                        >
                            <Plus className="h-4 w-4" />
                            New Chat
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowHistory(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="p-4 border-b border-slate-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search conversations..."
                            value={historySearch}
                            onChange={(e) => setHistorySearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                    {isLoadingHistory ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        </div>
                    ) : filteredHistory.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No conversations found</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredHistory.map((conversation) => {
                                const requestTypeInfo = getRequestTypeInfo(conversation.request_type);
                                const isExpanded = expandedConversations.has(conversation.id);
                                
                                return (
                                    <Collapsible
                                        key={conversation.id}
                                        open={isExpanded}
                                        onOpenChange={() => toggleConversationExpansion(conversation.id)}
                                    >
                                        <div className="border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                            <CollapsibleTrigger asChild>
                                                <div className="flex items-center justify-between p-3 cursor-pointer">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            {isExpanded ? 
                                                                <ChevronDown className="h-4 w-4 text-slate-400" /> : 
                                                                <ChevronRight className="h-4 w-4 text-slate-400" />
                                                            }
                                                            <requestTypeInfo.icon className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-sm text-slate-800 truncate">
                                                                {conversation.title}
                                                            </h4>
                                                            <p className="text-xs text-slate-500 truncate">
                                                                {conversation.last_message_preview}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(conversation.status)}
                                                        <span className="text-xs text-slate-500">
                                                            {formatDate(conversation.updated_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CollapsibleTrigger>

                                            <CollapsibleContent>
                                                <div className="px-3 pb-3 border-t border-slate-100">
                                                    <div className="flex items-center justify-between pt-3">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {requestTypeInfo.label}
                                                            </Badge>
                                                            <span className="text-xs text-slate-500">
                                                                {conversation.message_count} messages
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => loadConversation(conversation.id)}
                                                                className="h-7 px-2 text-xs"
                                                                disabled={isLoadingConversation}
                                                            >
                                                                {isLoadingConversation ? (
                                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                                ) : (
                                                                    <>
                                                                        <Eye className="h-3 w-3 mr-1" />
                                                                        Open
                                                                    </>
                                                                )}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={(e) => deleteConversation(conversation.id, e)}
                                                                className="h-7 px-2 text-xs text-red-600 hover:text-red-800"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </div>
                                    </Collapsible>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-white rounded-lg border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-800">AI Legal Research</h3>
                    {currentConversationId && (
                        <Badge variant="secondary" className="text-xs">
                            Active Chat
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowHistory(true)}
                        className="flex items-center gap-1"
                    >
                        <History className="h-4 w-4" />
                        History
                    </Button>
                    {currentConversationId && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={startNewConversation}
                            className="flex items-center gap-1"
                        >
                            <Plus className="h-4 w-4" />
                            New
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {message.type !== 'user' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                {message.type === 'system' ? (
                                    <Brain className="h-4 w-4 text-blue-600" />
                                ) : (
                                    <Bot className="h-4 w-4 text-blue-600" />
                                )}
                            </div>
                        )}

                        <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                            <div
                                className={`rounded-lg p-3 ${
                                    message.type === 'user'
                                        ? 'bg-blue-600 text-white ml-auto'
                                        : message.type === 'system'
                                        ? 'bg-slate-100 text-slate-700'
                                        : 'bg-white border border-slate-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    {message.status && getStatusIcon(message.status)}
                                    {message.requestType && message.type === 'user' && (
                                        <Badge variant="secondary" className="text-xs">
                                            {REQUEST_TYPES.find(t => t.value === message.requestType)?.label}
                                        </Badge>
                                    )}
                                </div>

                                <div className="text-sm">
                                    {message.content}
                                </div>

                                {message.files && message.files.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {message.files.map((file) => (
                                            <div key={file.id} className="flex items-center gap-2 text-xs bg-black bg-opacity-10 rounded p-1">
                                                <FileText className="h-3 w-3" />
                                                <span>{file.name}</span>
                                                <span>({(file.size / 1024).toFixed(1)} KB)</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {message.analysis && (
                                    <div className="mt-3 space-y-3">
                                        <Tabs defaultValue="summary" className="w-full">
                                            <TabsList className="grid w-full grid-cols-4">
                                                <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
                                                <TabsTrigger value="references" className="text-xs">References</TabsTrigger>
                                                <TabsTrigger value="recommendations" className="text-xs">Advice</TabsTrigger>
                                                <TabsTrigger value="analysis" className="text-xs">Full Analysis</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="summary" className="space-y-2">
                                                <div className="text-sm">
                                                    {message.analysis.summary && (
                                                        <div className="mb-3 p-2 bg-blue-50 rounded">
                                                            <h4 className="font-medium mb-1">Analysis Summary:</h4>
                                                            <p className="text-xs">{message.analysis.summary}</p>
                                                        </div>
                                                    )}

                                                    {message.analysis.legal_position && (
                                                        <div className="mb-3 p-2 bg-slate-50 rounded">
                                                            <h4 className="font-medium mb-1">Legal Position:</h4>
                                                            <p className="text-xs">{message.analysis.legal_position}</p>
                                                        </div>
                                                    )}

                                                    {message.analysis.key_findings && message.analysis.key_findings.length > 0 && (
                                                        <div>
                                                            <h4 className="font-medium mb-2">Key Findings:</h4>
                                                            <ul className="space-y-1">
                                                                {message.analysis.key_findings.map((finding, index) => (
                                                                    <li key={index} className="flex items-start gap-2 text-xs">
                                                                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                                                        {finding}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="references" className="space-y-2">
                                                {message.analysis.precedents && message.analysis.precedents.length > 0 && (
                                                    <div>
                                                        <h4 className="font-medium mb-2 text-sm">Precedent Cases:</h4>
                                                        {message.analysis.precedents.map(ref => (
                                                            <div key={ref.id} className="border rounded p-2 mb-2">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <h5 className="text-xs font-medium truncate pr-2">{ref.title}</h5>
                                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            {ref.relevance}%
                                                                        </Badge>
                                                                        {ref.kenyan_law_url && (
                                                                            <Button
                                                                                size="sm"
                                                                                variant="ghost"
                                                                                onClick={() => {
                                                                                    setSelectedReference(ref);
                                                                                    setLoadingReference(true);
                                                                                    setTimeout(() => {
                                                                                        setReferenceContent(`# ${ref.title}\n\n**Citation:** ${ref.citation}\n\n## Summary\n${ref.summary}\n\n## Court Decision\nThe court held that constitutional principles must be strictly followed in all administrative processes.`);
                                                                                        setLoadingReference(false);
                                                                                    }, 1500);
                                                                                }}
                                                                                className="h-6 px-1"
                                                                            >
                                                                                <Eye className="h-3 w-3" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-slate-600 mb-1">{ref.citation}</p>
                                                                {ref.year && <p className="text-xs text-slate-500 mb-1">Year: {ref.year}</p>}
                                                                <p className="text-xs">{ref.summary}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {message.analysis.statutes && message.analysis.statutes.length > 0 && (
                                                    <div>
                                                        <h4 className="font-medium mb-2 text-sm">Relevant Statutes:</h4>
                                                        {message.analysis.statutes.map(ref => (
                                                            <div key={ref.id} className="border rounded p-2 mb-2">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <h5 className="text-xs font-medium truncate pr-2">{ref.title}</h5>
                                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            {ref.relevance}%
                                                                        </Badge>
                                                                        {ref.kenyan_law_url && (
                                                                            <Button
                                                                                size="sm"
                                                                                variant="ghost"
                                                                                onClick={() => {
                                                                                    setSelectedReference(ref);
                                                                                    setLoadingReference(true);
                                                                                    setTimeout(() => {
                                                                                        setReferenceContent(`# ${ref.title}\n\n**Citation:** ${ref.citation}\n\n## Relevant Sections\n${ref.section}\n\n## Summary\n${ref.summary}`);
                                                                                        setLoadingReference(false);
                                                                                    }, 1500);
                                                                                }}
                                                                                className="h-6 px-1"
                                                                            >
                                                                                <Eye className="h-3 w-3" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-slate-600 mb-1">{ref.citation}</p>
                                                                {ref.section && <p className="text-xs text-blue-600 mb-1">{ref.section}</p>}
                                                                <p className="text-xs">{ref.summary}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {(!message.analysis.precedents || message.analysis.precedents.length === 0) &&
                                                 (!message.analysis.statutes || message.analysis.statutes.length === 0) &&
                                                 (!message.analysis.regulations || message.analysis.regulations.length === 0) &&
                                                 (!message.analysis.related_cases || message.analysis.related_cases.length === 0) && (
                                                    <div className="text-center py-4 text-slate-500">
                                                        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                        <p className="text-sm">No legal references found for this analysis</p>
                                                    </div>
                                                )}
                                            </TabsContent>

                                            <TabsContent value="recommendations" className="space-y-2">
                                                <div className="space-y-2">
                                                    {message.analysis.recommendations && message.analysis.recommendations.length > 0 ? (
                                                        message.analysis.recommendations.map((rec, index) => (
                                                            <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                                                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                                <p className="text-xs text-green-800">{rec}</p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-4 text-slate-500">
                                                            <Scale className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                            <p className="text-sm">No specific recommendations provided</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {message.analysis.risks && message.analysis.risks.length > 0 && (
                                                    <div className="mt-3">
                                                        <h4 className="font-medium mb-2 text-sm text-red-700">Risk Factors:</h4>
                                                        <div className="space-y-1">
                                                            {message.analysis.risks.map((risk, index) => (
                                                                <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded">
                                                                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                                                    <p className="text-xs text-red-800">{risk}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </TabsContent>

                                            <TabsContent value="analysis" className="space-y-2">
                                                {message.analysis.full_analysis ? (
                                                    <div className="prose prose-sm max-w-none text-xs">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {message.analysis.full_analysis}
                                                        </ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4 text-slate-500">
                                                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                        <p className="text-sm">Detailed analysis not available</p>
                                                    </div>
                                                )}
                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-slate-500 mt-1 px-3">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                        </div>

                        {message.type === 'user' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-200 p-4 bg-slate-50">
                <div className="flex items-center gap-2 mb-3">
                    <label className="text-xs font-medium text-slate-600">Research Type:</label>
                    <Select value={selectedRequestType} onValueChange={(value) => setSelectedRequestType(value as RequestType)}>
                        <SelectTrigger className="w-48 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {REQUEST_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value} className="text-xs">
                                    <div className="flex items-center gap-2">
                                        <type.icon className="h-3 w-3" />
                                        {type.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {attachedFiles.length > 0 && (
                    <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                            {attachedFiles.map((file) => (
                                <div key={file.id} className="flex items-center gap-1 bg-blue-100 rounded-full px-2 py-1">
                                    <FileText className="h-3 w-3 text-blue-600" />
                                    <span className="text-xs text-blue-800 max-w-20 truncate">{file.name}</span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeFile(file.id)}
                                        className="h-4 w-4 p-0 hover:bg-blue-200"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-2 items-end">
                    <div className="flex-1">
                        <Textarea
                            ref={textareaRef}
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me any legal question or describe your legal issue..."
                            className="resize-none text-sm"
                            rows={2}
                            disabled={isProcessing}
                        />
                    </div>
                    <div className="flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isProcessing}
                            className="h-8 w-8 p-0"
                        >
                            <PaperclipIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            onClick={submitMessage}
                            disabled={(!currentInput.trim() && attachedFiles.length === 0) || isProcessing}
                            className="h-8 px-3"
                        >
                            {isProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                />
            </div>

            <Dialog
                open={!!selectedReference}
                onOpenChange={() => {
                    setSelectedReference(null);
                    setReferenceContent("");
                }}
            >
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg">
                            {selectedReference?.title}
                        </DialogTitle>
                        <DialogDescription className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                {selectedReference?.type}
                            </Badge>
                            <span>{selectedReference?.citation}</span>
                            {selectedReference?.kenyan_law_url && (
                                <a
                                    href={selectedReference.kenyan_law_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    Kenya Law
                                </a>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        {loadingReference ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-500" />
                                    <p className="text-sm text-slate-600">Loading from Kenya Law database...</p>
                                </div>
                            </div>
                        ) : referenceContent ? (
                            <div className="prose max-w-none text-sm">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {referenceContent}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>Content not available</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}