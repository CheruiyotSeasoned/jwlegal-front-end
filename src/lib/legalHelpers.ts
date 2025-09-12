// Legal UI Helper Functions for Kenya Legal Chat Interface

// Required imports (add these to your main component)
import { 
  Scale, BookOpen, FileText, Book, Database, Search, Settings,
  CheckCircle, AlertCircle, XCircle, AlertTriangle, Copy,
  Briefcase, Home, Gavel, Mic, Send, Loader2, User
} from "lucide-react";
import { useState } from "react";

// Legal area specific quick prompts
const getLegalQuickPrompts = (legalArea) => {
  const prompts = {
    general: [
      { area: "General", question: "What are the main sources of law in Kenya?" },
      { area: "Courts", question: "How is the Kenyan court system structured?" },
      { area: "Rights", question: "What are my fundamental rights under the Constitution?" },
      { area: "Legal Aid", question: "How can I access legal aid in Kenya?" }
    ],
    constitutional: [
      { area: "Rights", question: "What rights are protected under Chapter 4 of the Constitution?" },
      { area: "Devolution", question: "How does devolution work in Kenya?" },
      { area: "Judiciary", question: "What is the structure of Kenya's judicial system?" },
      { area: "Amendment", question: "How can the Constitution be amended?" }
    ],
    contract_law: [
      { area: "Formation", question: "What makes a contract valid under Kenyan law?" },
      { area: "Breach", question: "What remedies are available for breach of contract?" },
      { area: "Employment", question: "What should be in an employment contract?" },
      { area: "Sale of Goods", question: "What are my rights under the Sale of Goods Act?" }
    ],
    employment_law: [
      { area: "Rights", question: "What are my rights under the Employment Act 2007?" },
      { area: "Dismissal", question: "What constitutes unfair dismissal in Kenya?" },
      { area: "Leave", question: "What types of leave am I entitled to?" },
      { area: "Disputes", question: "How do I resolve an employment dispute?" }
    ],
    criminal_law: [
      { area: "Rights", question: "What are the rights of an accused person?" },
      { area: "Bail", question: "How does the bail system work in Kenya?" },
      { area: "Procedure", question: "What is the criminal court procedure?" },
      { area: "Evidence", question: "What types of evidence are admissible in court?" }
    ],
    family_law: [
      { area: "Marriage", question: "What are the legal requirements for marriage in Kenya?" },
      { area: "Divorce", question: "What are the grounds for divorce?" },
      { area: "Custody", question: "How is child custody determined?" },
      { area: "Maintenance", question: "How is child maintenance calculated?" }
    ],
    commercial_law: [
      { area: "Companies", question: "How do I register a company in Kenya?" },
      { area: "Partnership", question: "What are the types of business partnerships?" },
      { area: "Insolvency", question: "What is the process for company liquidation?" },
      { area: "Competition", question: "What does the Competition Act prohibit?" }
    ],
    land_law: [
      { area: "Ownership", question: "What are the types of land ownership in Kenya?" },
      { area: "Transfer", question: "How do I transfer land ownership?" },
      { area: "Disputes", question: "How are land disputes resolved?" },
      { area: "Compulsory", question: "When can the government acquire private land?" }
    ]
  };
  
  return prompts[legalArea] || prompts.general;
};

// Document assistance handler
const handleDocumentAssistance = (
  documentType: string,
  setInputValue: (val: string) => void,
  setSelectedLegalArea: (val: string) => void
) => {
  const documentQuestions: Record<string, string> = {
    contract_review: "I need help reviewing a contract. What should I look for in terms of legal compliance?",
    employment: "I'm having issues at work. Can you guide me on employment law protections?",
    land_law: "I'm buying/selling property. What legal requirements must I fulfill?",
    procedure: "I need to go to court. What are the procedures I should follow?"
  };

  const question = documentQuestions[documentType];
  if (question) {
    setInputValue(question);

    const areaMapping: Record<string, string> = {
      contract_review: "contract_law",
      employment: "employment_law",
      land_law: "land_law",
      procedure: "general"
    };

    setSelectedLegalArea(areaMapping[documentType] || "general");
  }
};

// Copy to clipboard function
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    // You can add a toast notification here
    console.log("Copied to clipboard:", text);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

// Enhanced message handler with legal features
const handleSendMessage = async (
  setMessages: (fn: (prev: any[]) => any[]) => void,
  inputValue: string,
  setInputValue: (val: string) => void,
  isLoading: boolean,
  setIsLoading: (val: boolean) => void,
  setShowQuickQuestions: (val: boolean) => void,
  selectedLegalArea: string,
  casePreference: string,
  citationLevel: string,
  getConversationHistory: () => any,
) => {
  if (!inputValue.trim() || isLoading) return;

  const userMessage = {
    id: Date.now().toString(),
    type: "user",
    content: inputValue,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");
  setIsLoading(true);
  setShowQuickQuestions(false);

  try {
    const res = await fetch("http://localhost:8000/legal/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        message: userMessage.content,
        legal_area: selectedLegalArea || "general",
        case_preference: casePreference || "recent",
        citation_level: citationLevel || "medium",
        context_history: getConversationHistory(),
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    const aiResponse = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: data.reply,
      timestamp: new Date(),
      legalArea: data.legal_area,
      responseTimestamp: data.timestamp,
      disclaimer: data.disclaimer,
      citations: extractCitations(data.reply),
      confidence: calculateConfidence(data.reply, data.legal_area),
    };

    setMessages((prev) => [...prev, aiResponse]);
  } catch (err) {
    console.error("Legal chat error:", err);
    
    const errorResponse = {
      id: (Date.now() + 2).toString(),
      type: "assistant",
      content: `I apologize, but I'm having trouble accessing the legal database. ${err.message || 'Please try again in a moment.'}`,
      timestamp: new Date(),
      isError: true,
    };
    setMessages((prev) => [...prev, errorResponse]);
  } finally {
    setIsLoading(false);
  }
};

// Legal research handler
const handleLegalResearch = async (
  setMessages: (fn: (prev: any[]) => any[]) => void,
  setInputValue: (val: string) => void,
  setIsLoading: (val: boolean) => void,
  query: string,
  searchType = "case_law"
) => {
  if (!query.trim()) {
    setInputValue("Please provide a specific legal research query");
    return;
  }

  setIsLoading(true);
  
  const researchMessage = {
    id: Date.now().toString(),
    type: "user",
    content: `🔍 Research Query: ${query}`,
    timestamp: new Date(),
  };
  
  setMessages((prev) => [...prev, researchMessage]);
  
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
      }),
    });

    if (!res.ok) {
      throw new Error(`Research API Error: ${res.status}`);
    }

    const data = await res.json();

    const researchResponse = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: data.research_result,
      timestamp: new Date(),
      searchType: data.search_type,
      isResearch: true,
      responseTimestamp: data.timestamp,
      citations: extractCitations(data.research_result),
      confidence: 0.85, // Research typically has higher confidence
    };

    setMessages((prev) => [...prev, researchResponse]);
  } catch (err) {
    console.error("Legal research error:", err);
    const errorResponse = {
      id: Date.now().toString(),
      type: "assistant",
      content: "I encountered an error while conducting legal research. Please try again with a more specific query.",
      timestamp: new Date(),
      isError: true,
    };
    setMessages((prev) => [...prev, errorResponse]);
  } finally {
    setIsLoading(false);
  }
};

// Quick prompt handler
const handleQuickPrompt = (
  prompt,
  setMessages,
  inputValue,
  setInputValue,
  isLoading,
  setIsLoading,
  setShowQuickQuestions,
  selectedLegalArea,
  casePreference,
  citationLevel,
  messages
) => {
  setInputValue(prompt);
  setShowQuickQuestions(false);
  // Auto-send after a brief delay
  setTimeout(() => {
    handleSendMessage(
      setMessages,
      inputValue,
      setInputValue,
      isLoading,
      setIsLoading,
      setShowQuickQuestions,
      selectedLegalArea,
      casePreference,
      citationLevel,
      () => getConversationHistory(messages)
    );
  }, 100);
};

// Get conversation history for context
const getConversationHistory = (messages) => {
  return messages.slice(-6).map(msg => ({
    role: msg.type === "user" ? "user" : "assistant",
    content: msg.content
  }));
};

// Extract legal citations (enhanced version)
const extractCitations = (responseText) => {
  const citations = [];
  
  // Kenyan case law patterns
  const casePatterns = [
    /\[(19|20)\d{2}\]\s*eKLR/gi,
    /\[(19|20)\d{2}\]\s*KLR/gi,
    /\[(19|20)\d{2}\]\s*\d+\s*KLR/gi,
  ];
  
  casePatterns.forEach(pattern => {
    const matches = responseText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        citations.push({ type: 'case', citation: match.trim() });
      });
    }
  });
  
  // Statutory citations
  const statutePatterns = [
    /\b\w+\s+Act,?\s+(19|20)\d{2}/gi,
    /Constitution.*2010/gi,
    /Employment Act.*2007/gi,
    /Companies Act.*2015/gi,
  ];
  
  statutePatterns.forEach(pattern => {
    const matches = responseText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        citations.push({ type: 'statute', citation: match.trim() });
      });
    }
  });
  
  // Remove duplicates
  const uniqueCitations = citations.filter((citation, index, self) => 
    index === self.findIndex(c => c.citation === citation.citation)
  );
  
  return uniqueCitations.length > 0 ? uniqueCitations : [{ type: 'general', citation: 'Kenya Law Database' }];
};

// Calculate confidence score
const calculateConfidence = (responseText, legalArea) => {
  let confidence = 0.7;
  
  // Boost for legal citations
  if (responseText.includes('eKLR') || responseText.includes('Act')) confidence += 0.1;
  
  // Boost for specific legal areas
  if (legalArea !== 'general') confidence += 0.1;
  
  // Boost for comprehensive responses
  if (responseText.length > 500) confidence += 0.05;
  if (responseText.length > 1000) confidence += 0.05;
  
  // Boost for structured responses (sections, numbered points)
  if (responseText.includes('1.') || responseText.includes('•')) confidence += 0.05;
  
  return Math.min(confidence, 0.95);
};



export {
  getLegalQuickPrompts,
  handleDocumentAssistance,
  copyToClipboard,
  handleSendMessage,
  handleLegalResearch,
  handleQuickPrompt,
  getConversationHistory,
  extractCitations,
  calculateConfidence
};
    function setShowQuickQuestions(arg0: boolean) {
        throw new Error("Function not implemented.");
    }

function setIsLoading(arg0: boolean) {
    throw new Error("Function not implemented.");
}

