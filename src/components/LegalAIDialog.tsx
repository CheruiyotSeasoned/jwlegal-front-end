import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  Search, 
  BookOpen, 
  Scale, 
  Clock,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  X,
  MessageSquare,
  Lightbulb,
  Shield,
  CheckCircle,
  Home,
  Heart,
  Leaf,
  Plus,
  Trash2,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'quick-question';
  content: string;
  timestamp: Date;
  citations?: string[];
  confidence?: number;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
  messageCount: number;
}

interface LegalAIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LegalAIDialog = ({ open, onOpenChange }: LegalAIDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Legal Research Assistant. I can help you with Kenyan law research, case analysis, legal document review, and more. What legal question can I help you with today?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    { id: '1', title: 'Civil Procedure Inquiry', timestamp: new Date(), messageCount: 5 },
    { id: '2', title: 'Constitutional Rights', timestamp: new Date(Date.now() - 86400000), messageCount: 3 },
    { id: '3', title: 'Business Registration', timestamp: new Date(Date.now() - 172800000), messageCount: 7 },
  ]);
  const [currentChatId, setCurrentChatId] = useState('1');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const legalCategories = [
    { id: 'constitutional', label: 'Constitutional Law', icon: Shield, color: 'bg-blue-100 text-blue-700' },
    { id: 'criminal', label: 'Criminal Law', icon: Scale, color: 'bg-red-100 text-red-700' },
    { id: 'civil', label: 'Civil Law', icon: FileText, color: 'bg-green-100 text-green-700' },
    { id: 'commercial', label: 'Commercial Law', icon: BookOpen, color: 'bg-purple-100 text-purple-700' },
    { id: 'employment', label: 'Employment Law', icon: User, color: 'bg-orange-100 text-orange-700' },
    { id: 'property', label: 'Property Law', icon: Home, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'family', label: 'Family Law', icon: Heart, color: 'bg-pink-100 text-pink-700' },
    { id: 'environmental', label: 'Environmental Law', icon: Leaf, color: 'bg-emerald-100 text-emerald-700' },
  ];

  const quickPrompts = [
    'What are the requirements for filing a civil suit in Kenya?',
    'Explain the constitutional rights of an accused person',
    'How do I register a business in Kenya?',
    'What are the grounds for divorce in Kenya?',
    'Explain the Data Protection Act 2019',
    'What are the penalties for traffic offenses?',
  ];

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowQuickQuestions(false);

    // Simulate AI response (replace with actual GPT integration later)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I understand you're asking about "${inputValue}". This is a placeholder response that will be replaced with actual GPT integration. The AI will provide comprehensive legal analysis based on Kenyan law, including relevant statutes, case law, and practical guidance.`,
        timestamp: new Date(),
        citations: ['Constitution of Kenya 2010', 'Civil Procedure Act', 'Sample Case Law 2023'],
        confidence: 0.85,
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleQuickPrompt = (prompt: string) => {
    const quickMessage: Message = {
      id: Date.now().toString(),
      type: 'quick-question',
      content: prompt,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, quickMessage]);
    setShowQuickQuestions(false);
    setInputValue(prompt);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = legalCategories.find(c => c.id === categoryId);
    if (category) {
      const categoryMessage: Message = {
        id: Date.now().toString(),
        type: 'quick-question',
        content: `I need help with ${category.label.toLowerCase()} in Kenya.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, categoryMessage]);
      setShowQuickQuestions(false);
      setInputValue(`I need help with ${category.label.toLowerCase()} in Kenya.`);
    }
  };

  const startNewChat = () => {
    setMessages([{
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Legal Research Assistant. I can help you with Kenyan law research, case analysis, legal document review, and more. What legal question can I help you with today?',
      timestamp: new Date(),
    }]);
    setShowQuickQuestions(true);
    setCurrentChatId(Date.now().toString());
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-[80vw] h-[80vh] p-0 flex">
        {/* Sidebar - Chat History */}
        <div className="w-80 border-r bg-gray-50 flex flex-col">
          <div className="p-4 border-b bg-white">
            <Button 
              onClick={startNewChat}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-colors",
                    currentChatId === chat.id 
                      ? "bg-blue-100 text-blue-700" 
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => setCurrentChatId(chat.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{chat.title}</p>
                      <p className="text-xs text-gray-500">
                        {chat.timestamp.toLocaleDateString()} • {chat.messageCount} messages
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <DialogHeader className="p-4 border-b bg-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    AI Legal Research Assistant
                  </DialogTitle>
                  <p className="text-xs text-gray-600 flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Powered by Kenya Law Database
                    <Badge variant="outline" className="ml-2 text-xs">Beta</Badge>
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Legal Categories */}
          <div className="p-4 border-b bg-gray-50 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">Choose Legal Area</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {legalCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategorySelect(category.id)}
                  className={cn(
                    "h-10 flex flex-col items-center justify-center gap-1 text-xs",
                    selectedCategory === category.id && category.color
                  )}
                >
                  <category.icon className="h-3 w-3" />
                  <span className="text-xs">{category.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 min-h-0 bg-white">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.type === 'assistant' && (
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    
                    <div className={cn(
                      "max-w-[75%] space-y-2",
                      message.type === 'user' ? 'order-first' : 'order-last'
                    )}>
                      <Card className={cn(
                        "p-3",
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : message.type === 'quick-question'
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-white border-gray-200'
                      )}>
                        <CardContent className="p-0">
                          <p className={cn(
                            "text-sm leading-relaxed",
                            message.type === 'user' ? 'text-white' : 'text-gray-800'
                          )}>
                            {message.content}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Citations and Confidence for AI responses */}
                      {message.type === 'assistant' && message.citations && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FileText className="h-3 w-3" />
                            <span>Sources: {message.citations.join(', ')}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(message.citations!.join(', '))}
                              className="h-4 w-4 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          {message.confidence && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-green-500 h-1.5 rounded-full" 
                                    style={{ width: `${message.confidence * 100}%` }}
                                  />
                                </div>
                                <span>{Math.round(message.confidence * 100)}% confidence</span>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className={cn(
                        "text-xs text-gray-400",
                        message.type === 'user' ? 'text-right' : 'text-left'
                      )}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>

                    {message.type === 'user' && (
                      <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Quick Questions in Chat Space */}
                {showQuickQuestions && (
                  <div className="flex justify-start">
                    <div className="max-w-[75%] space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">Quick Questions</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {quickPrompts.map((prompt, index) => (
                          <Card 
                            key={index}
                            className="cursor-pointer hover:shadow-md transition-shadow border-gray-200"
                            onClick={() => handleQuickPrompt(prompt)}
                          >
                            <CardContent className="p-3">
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {prompt}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <Card className="bg-white border-gray-200">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          <span className="text-sm text-gray-600">Researching Kenyan law...</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about Kenyan law, legal procedures, case analysis..."
                className="flex-1 text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Powered by Kenya Legal AI Database</span>
              <span>Free Research Assistant</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 