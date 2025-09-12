import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Send,
  Bot,
  User,
  FileText,
  Search,
  BookOpen,
  Gavel,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  X,
  MessageSquare,
  CheckCircle,
  ExternalLink,
  Download,
  Share2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CaseDetailsDisplay from './CaseDetailsDisplay';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'case-law';
  content: string;
  timestamp: Date;
  citations?: string[];
  confidence?: number;
  caseReference?: string;
  statuteReference?: string;
}

export interface KenyaLawCase {
  id: string;
  title: string;
  citation: string;
  year: number;
  court: string;
  overview?: string;
  summary: string;
  explainers?: {
    relevance: string;
    highlight: {
      content: string[];  // <-- fix here: highlight is an object with content array
    };
    case_importance: string;
  };
  attorneys?: string[] | null;
  relevance: number;
  // Extended properties for full case view
  judges?: string[];
  parties?: {
    appellant?: string;
    respondent?: string;
    plaintiff?: string;
    defendant?: string;
  };
  dateDelivered?: string;
  caseNumber?: string;
  keywords?: string[];
  headnotes?: string;
  registry?: string | null;
  judgmentReferences?: string[];
  fullText?: string;
  attachments?: string[];
  precedents?: string[];
  legislation?: string[];
  gpt_reasoning?: string[];
}
interface KenyaLawStatute {
  id: string;
  title: string;
  section: string;
  chapter: string;
  content: string;
  relevance: number;
}

interface CaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseType: string;
  caseTitle: string;
  category: 'criminal' | 'civil';
}

export default function CaseDialog({ open, onOpenChange, caseType, caseTitle, category }: CaseDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello! I'm your AI Legal Assistant specializing in ${caseType} cases under Kenyan law. I can help you understand the legal framework, relevant statutes, case law, and procedural requirements for ${caseTitle}. What specific aspect would you like to explore?`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('cases');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // API Configuration
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  // Case law state
  const [relevantCases, setRelevantCases] = useState<{ cases: KenyaLawCase[], totalResults: number }>({
    cases: [],
    totalResults: 0
  });
  const [localCases, setLocalCases] = useState<KenyaLawCase[]>([]);
  const [caseFilters, setCaseFilters] = useState({
    year: '',
    court: '',
    minRelevance: '',
    searchTerm: '',
    searchType: 'both' // 'local', 'online', 'both'
  });
  const [debouncedFilters, setDebouncedFilters] = useState(caseFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingCases, setIsLoadingCases] = useState(false);
  const casesPerPage = 10;
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Statute state
  const [relevantStatutes, setRelevantStatutes] = useState<KenyaLawStatute[]>([]);

  // Case detail dialog state
  const [selectedCase, setSelectedCase] = useState<KenyaLawCase | null>(null);
  const [isLoadingCaseDetails, setIsLoadingCaseDetails] = useState(false);

  const quickQuestions = [
    `What are the elements of ${caseType} under Kenyan law?`,
    `What are the penalties for ${caseType}?`,
    `What is the procedure for filing a ${caseType} case?`,
    `What defenses are available for ${caseType}?`,
    `What evidence is required to prove ${caseType}?`,
    `How long does a ${caseType} case typically take?`
  ];

  // Mock local data for demonstration
  const mockLocalCases: KenyaLawCase[] = [];

  // Debounce function
  const debounceFilters = useCallback((newFilters: typeof caseFilters) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedFilters(newFilters);
    }, 500); // 500ms delay
  }, []);

  // Update debounced filters when caseFilters change
  useEffect(() => {
    debounceFilters(caseFilters);

    // Cleanup timeout on unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [caseFilters, debounceFilters]);

  // Custom filter update function that handles immediate vs debounced updates
  const updateFilters = (newFilters: Partial<typeof caseFilters>) => {
    const updatedFilters = { ...caseFilters, ...newFilters };
    setCaseFilters(updatedFilters);

    // For non-text fields, update immediately
    const immediateFields = ['searchType', 'year', 'court', 'minRelevance'];
    const hasImmediateChange = Object.keys(newFilters).some(key =>
      immediateFields.includes(key) && newFilters[key as keyof typeof newFilters] !== undefined
    );

    if (hasImmediateChange && !newFilters.searchTerm) {
      setDebouncedFilters(updatedFilters);
    }
  };
  // Function to fetch full case details
  const [caseData, setCaseData] = useState(null);
  const fetchCaseDetails = async (caseId: string): Promise<KenyaLawCase | null> => {

    try {
      // Handle mock local cases
      if (caseId.startsWith('local-')) {
        const localCase = mockLocalCases.find(c => c.id === caseId);
        return localCase || null;
      }

      // Fetch both metadata and full content
      const [metaRes, fullRes] = await Promise.all([
        fetch(`${API_BASE_URL}/kenyalaw/document/${caseId}`), // Your index/search endpoint
        fetch(`${API_BASE_URL}/kenyalaw/document/html/${caseId}`) // Your full doc endpoint
      ]);

      if (!metaRes.ok && !fullRes.ok) {
        throw new Error(`Failed to fetch case details for ${caseId}`);
      }

      const metaDoc = metaRes.ok ? await metaRes.json() : {};
      const fullDoc = fullRes.ok ? await fullRes.json() : {};

      // Merge: fullDoc takes priority for content, metaDoc for missing fields
      const doc = { ...metaDoc, ...fullDoc };

      /** ───── Parties Extraction ───── **/
      let partiesData = doc.parties;
      if (!partiesData) {
        const titleText = doc.title || '';
        const match = titleText.match(/(.+?)\s+v(?:s\.?)?\s+(.+)/i);
        if (match) {
          partiesData = {
            plaintiff: match[1].split(',').map(p => p.trim()),
            defendant: match[2].split(',').map(p => p.trim()),
          };
        } else {
          partiesData = { plaintiff: [], defendant: [] };
        }
      }

      /** ───── Overview ───── **/
      let overviewText =
        doc.overview || doc.case_overview || doc.summary || null;
      if (!overviewText && (doc.full_text || doc.content_html)) {
        const firstParagraph = (doc.full_text || doc.content_html)
          .split(/\n\s*\n/)[0];
        if (firstParagraph) overviewText = firstParagraph.trim();
      }

      /** ───── Judgment References ───── **/
      const judgmentReferences = [
        ...(doc.references || []),
        ...(doc.judgment_references || []),
        ...(doc.references_cases || []),
        ...(doc.references_legislation || []),
        ...(doc.citations || [])
      ].filter(Boolean);

      /** ───── Relevance Normalization ───── **/
      const normalizedRelevance = doc._score
        ? parseFloat((doc._score / 100).toFixed(3))
        : doc.relevance || 0.5;

      /** ───── Explainability ───── **/
      const explainers = {
        relevance: `This case matched your query with a normalized score of ${normalizedRelevance}. Original score: ${doc._score || 'N/A'}.`,
        highlight: {
          content: doc.highlight?.content?.length
            ? doc.highlight.content
            : ['No specific search term highlights available.']
        },
        case_importance: `This ${doc.nature?.toLowerCase() || 'judgment'} was delivered by the ${doc.court} on ${doc.date}. It involves ${partiesData.plaintiff.join(', ')} and ${partiesData.defendant.join(', ')}. The registry handling the case was ${doc.registry || 'unknown registry'}.`
      };


      /** ───── Transform to KenyaLawCase ───── **/
      const transformedCase: KenyaLawCase = {
        id: doc.id || caseId,
        title: doc.title || doc.case_title || 'Unknown Title',
        citation:
          doc.citation ||
          doc.case_citation ||
          (doc.alternative_names?.[0] || 'No Citation'),
        year: doc.year || new Date(doc.date || Date.now()).getFullYear(),
        court: doc.court || doc.court_name || 'Unknown Court',
        registry: doc.registry || doc.locality || null,
        summary: doc.summary || doc.case_summary || 'No summary available',
        overview: overviewText || 'No overview available',
        relevance: normalizedRelevance,
        judges: doc.judges || [],
        attorneys: doc.attorneys || null,
        parties: partiesData || {},
        dateDelivered: doc.dateDelivered || doc.date || null,
        caseNumber: doc.caseNumber || doc.case_number || '',
        keywords: doc.keywords || [],
        headnotes: doc.headnotes || doc.head_notes || null,
        fullText:
          doc.fullText ||
          doc.full_text ||
          doc.content_text ||
          doc.raw ||
          doc.judgment ||
          null,
        precedents: doc.precedents || doc.cited_cases || [],
        legislation: doc.legislation || doc.cited_legislation || [],
        judgmentReferences: judgmentReferences || [],
        attachments: doc.attachments || [],
        explainers: explainers
          ? {
            relevance: explainers.relevance || '',
            case_importance: explainers.case_importance || '',
            highlight: {
              content: explainers.highlight?.content || []
            }
          }
          : {
            relevance: '',
            case_importance: '',
            highlight: { content: [] }
          },
        gpt_reasoning: doc.gpt_reasoning || []
      };



      return transformedCase;
    } catch (error) {
      console.error('Error fetching case details:', error);
      return null;
    } finally {
      // setIsLoadingCaseDetails(false);
    }
  };




  const handleViewCase = async (caseId: string) => {
    const caseDetails = await fetchCaseDetails(caseId);
    if (caseDetails) {
      setSelectedCase(caseDetails);
    }
  };
  const handleFetchCase = async (caseId: string) => {
    setIsLoadingCaseDetails(true);
    const result = await fetchCaseDetails(caseId); // Your existing function
    setCaseData(result);
    setIsLoadingCaseDetails(false);
  };
  const searchOnlineCases = async (filters: typeof caseFilters, page: number): Promise<{ cases: KenyaLawCase[], totalResults: number }> => {
    try {
      const params = new URLSearchParams();

      // Required search term (use caseType if no specific search term)
      params.append('search_term', filters.searchTerm || caseType);
      params.append('page', page.toString());
      params.append('page_size', casesPerPage.toString());

      if (filters.court) params.append('court_filter', filters.court);
      if (filters.year) params.append('year_filter', filters.year);
      if (filters.minRelevance) params.append('min_relevance', (parseFloat(filters.minRelevance) / 100).toString());

      // Optional cache settings
      params.append('use_cache', 'true');
      params.append('cache_max_age_hours', '24');

      const response = await fetch(`${API_BASE_URL}/kenyalaw/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const rawCases = Array.isArray(data.results)
        ? data.results.flat()   // flatten nested array
        : (data.cases || []);

      // Transform API response to match our interface
      const transformedCases: KenyaLawCase[] = rawCases.map((apiCase: any, index: number) => ({
        id: `${apiCase.id || index}`,
        title: apiCase.title || apiCase.case_title || 'Unknown Title',
        citation: apiCase.citation || apiCase.case_citation || 'No Citation',
        year: apiCase.year || new Date(apiCase.date || Date.now()).getFullYear(),
        court: apiCase.court || apiCase.court_name || 'Unknown Court',
        summary: apiCase.summary || apiCase.case_summary || 'No summary available',
        relevance: apiCase.relevance || apiCase.relevance_score || 0.5
      }));

      return {
        cases: transformedCases,
        totalResults: data.totalResults || data.total_count || transformedCases.length
      };
    } catch (error) {
      console.error('Error fetching online cases:', error);
      return { cases: [], totalResults: 0 };
    }
  };

  const searchLocalCases = (filters: typeof caseFilters): KenyaLawCase[] => {
    return mockLocalCases.filter(caseLaw => {
      // Year filter
      if (filters.year && caseLaw.year.toString() !== filters.year) return false;

      // Court filter
      if (filters.court && !caseLaw.court.toLowerCase().includes(filters.court.toLowerCase())) return false;

      // Minimum relevance filter
      if (filters.minRelevance && caseLaw.relevance * 100 < Number(filters.minRelevance)) return false;

      // Search term filter
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        return caseLaw.title.toLowerCase().includes(searchTerm) ||
          caseLaw.summary.toLowerCase().includes(searchTerm) ||
          caseLaw.court.toLowerCase().includes(searchTerm) ||
          caseLaw.citation.toLowerCase().includes(searchTerm);
      }

      return true;
    });
  };

  const fetchFilteredCases = async (filters = debouncedFilters, page = currentPage) => {
    setIsLoadingCases(true);
    try {
      let localResults: KenyaLawCase[] = [];
      let onlineResults: { cases: KenyaLawCase[], totalResults: number } = { cases: [], totalResults: 0 };

      // Fetch local cases
      if (filters.searchType === 'local' || filters.searchType === 'both') {
        localResults = searchLocalCases(filters);
      }

      // Fetch online cases
      if (filters.searchType === 'online' || filters.searchType === 'both') {
        onlineResults = await searchOnlineCases(filters, page);
      }

      // Combine results
      let combinedCases: KenyaLawCase[] = [];
      let totalResults = 0;

      if (filters.searchType === 'both') {
        // Combine local and online, sort by relevance
        combinedCases = [...localResults, ...onlineResults.cases]
          .sort((a, b) => b.relevance - a.relevance);
        totalResults = localResults.length + onlineResults.totalResults;
      } else if (filters.searchType === 'local') {
        combinedCases = localResults.sort((a, b) => b.relevance - a.relevance);
        totalResults = localResults.length;
      } else {
        combinedCases = onlineResults.cases;
        totalResults = onlineResults.totalResults;
      }

      setRelevantCases({
        cases: combinedCases,
        totalResults: totalResults
      });

    } catch (error) {
      console.error('Error fetching filtered cases:', error);
      setRelevantCases({ cases: [], totalResults: 0 });
    } finally {
      setIsLoadingCases(false);
    }
  };

  // Load data when debounced filters change
  useEffect(() => {
    if (open) {
      fetchFilteredCases();
    }
  }, [open, debouncedFilters, currentPage]);

  // Reset to page 1 when filters change (except page change)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedFilters.searchTerm, debouncedFilters.year, debouncedFilters.court, debouncedFilters.minRelevance, debouncedFilters.searchType]);

  const mockStatutes: KenyaLawStatute[] = [
    {
      id: '1',
      title: 'Penal Code',
      section: 'Section 203',
      chapter: 'Chapter 63',
      content: 'Any person who unlawfully causes the death of another person is guilty of murder.',
      relevance: 0.98
    },
    {
      id: '2',
      title: 'Criminal Procedure Code',
      section: 'Section 210',
      chapter: 'Chapter 75',
      content: 'Procedures for charging and trying murder cases in Kenya.',
      relevance: 0.91
    }
  ];

  // Load mock data when dialog opens
  useEffect(() => {
    if (open) {
      setLocalCases(mockLocalCases);
      setRelevantStatutes(mockStatutes);
      // Initial case search will be triggered by the filters useEffect
    }
  }, [open]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter cases based on filters (now handled by API calls)
  const totalPages = Math.ceil(relevantCases.totalResults / casesPerPage);
  const displayedCases = relevantCases.cases;

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const question = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock response based on question
      let responseContent = '';
      if (question.toLowerCase().includes('elements')) {
        responseContent = `Under Kenyan law, ${caseType} requires proof of the following elements:\n\n1. **Actus Reus**: The physical act causing death\n2. **Mens Rea**: Intent to cause death or grievous bodily harm\n3. **Causation**: The act must be the proximate cause of death\n4. **Unlawfulness**: The killing must be unlawful\n\nRelevant statute: Penal Code Section 203 defines murder as unlawfully causing the death of another person.`;
      } else if (question.toLowerCase().includes('penalties')) {
        responseContent = `The penalties for ${caseType} under Kenyan law are:\n\n• **Mandatory death penalty** (though commuted to life imprisonment since 2017)\n• **Life imprisonment** is now the standard sentence\n• **Minimum of 15 years** before parole consideration\n\nNote: Kenya abolished the mandatory death penalty in 2017, and all death sentences were commuted to life imprisonment.`;
      } else if (question.toLowerCase().includes('procedure')) {
        responseContent = `The procedure for ${caseType} cases involves:\n\n1. **Investigation** by police\n2. **DPP authorization** for prosecution\n3. **Arraignment** before a magistrate\n4. **Committal proceedings** (if magistrate's case)\n5. **High Court trial** (murder is a High Court matter)\n6. **Jury trial** (in some instances)\n\nTimeline: Typically 12-24 months from charge to conclusion.`;
      } else {
        responseContent = `I understand you're asking about ${caseType}. Based on Kenyan jurisprudence and statutory law, I can provide detailed guidance on this matter. The legal framework governing ${caseType} is primarily found in the Penal Code and has been interpreted through various High Court and Court of Appeal decisions.\n\nWould you like me to elaborate on any specific aspect such as the elements of the offense, available defenses, or procedural requirements?`;
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        citations: ['Penal Code Cap 63', 'Kenya Law Reports', 'High Court Decisions'],
        confidence: 0.89,
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting legal advice:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const fetchSummary = async (docId: string) => {
    if (!docId) {
      setError("Document ID not found");
      return;
    }

    if (summary || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://legalbuddyapi.aiota.online/kenyalaw/document/${docId}/summary?force_refresh=false`
      );
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setError("Failed to load summary");
    } finally {
      setLoading(false);
    }
  };


  const handleQuickQuestion = async (question: string) => {
    setInputValue(question);
    setTimeout(handleSendMessage, 100);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-[90vw] h-[90vh] p-0 flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <DialogHeader className="p-4 border-b bg-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${category === 'criminal' ? 'bg-red-100' : 'bg-blue-100'}`}>
                  <Gavel className={`h-5 w-5 ${category === 'criminal' ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    {caseTitle} - Legal Research Assistant
                  </DialogTitle>
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

          {/* Tabs */}
          <div className="border-b bg-gray-50">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cases" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Case Law
                </TabsTrigger>
                <TabsTrigger value="statutes" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Statutes
                </TabsTrigger>
              </TabsList>
            </Tabs>

          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">


              <TabsContent value="cases" className="h-full">
                <div className="p-4 h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">Relevant Case Law</h3>
                    <p className="text-sm text-gray-600">Recent Kenyan cases related to {caseType}</p>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <select
                      value={caseFilters.searchType}
                      onChange={e => updateFilters({ searchType: e.target.value as 'local' | 'online' | 'both' })}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                    >
                      <option value="both">Local + Online</option>
                      <option value="local">Local Only</option>
                      <option value="online">Online Only</option>
                    </select>
                    <Input
                      placeholder="Search title, summary, court..."
                      value={caseFilters.searchTerm}
                      onChange={e => updateFilters({ searchTerm: e.target.value })}
                      className="w-1/3 min-w-[200px]"
                    />
                    <Input
                      placeholder="Year"
                      type="number"
                      value={caseFilters.year}
                      onChange={e => updateFilters({ year: e.target.value })}
                      className="w-24"
                    />
                    <Input
                      placeholder="Court"
                      value={caseFilters.court}
                      onChange={e => updateFilters({ court: e.target.value })}
                      className="w-1/4 min-w-[150px]"
                    />
                    <Input
                      placeholder="Min % relevance"
                      type="number"
                      value={caseFilters.minRelevance}
                      onChange={e => updateFilters({ minRelevance: e.target.value })}
                      className="w-32"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fetchFilteredCases(caseFilters, currentPage)}
                      disabled={isLoadingCases}
                      className="flex items-center gap-2"
                    >
                      {isLoadingCases ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      Search
                    </Button>
                  </div>

                  {/* Results summary */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <span>
                      {relevantCases.totalResults} results found
                      {caseFilters.searchType === 'both' && localCases.length > 0 && (
                        <span className="ml-1">
                          ({localCases.filter(c => searchLocalCases(debouncedFilters).includes(c)).length} local,
                          {relevantCases.totalResults - localCases.filter(c => searchLocalCases(debouncedFilters).includes(c)).length} online)
                        </span>
                      )}
                    </span>
                    {isLoadingCases && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Searching...</span>
                      </div>
                    )}
                    {caseFilters.searchTerm !== debouncedFilters.searchTerm && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <Clock className="h-3 w-3" />
                        <span>Typing...</span>
                      </div>
                    )}
                  </div>

                  {/* Scrollable Case List */}
                  <ScrollArea className="flex-1">
                    <div className="space-y-3">
                      {displayedCases.map((caseLaw) => (
                        <Card key={caseLaw.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex flex-col gap-3">
                              {/* Case Info */}
                              <div className="flex flex-col">
                                <h4 className="font-semibold text-gray-900">{caseLaw.title}</h4>
                                <p className="text-sm text-gray-600">{caseLaw.citation} ({caseLaw.year})</p>
                                <p className="text-sm text-gray-500">{caseLaw.court}</p>
                                <p className="text-sm text-gray-700 mt-2">{caseLaw.summary}</p>
                              </div>

                              {/* Relevance & Actions */}
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {Math.round(caseLaw.relevance * 100)}% relevant
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs"
                                  onClick={() => handleFetchCase(caseLaw.id)}
                                  disabled={isLoadingCaseDetails}
                                >
                                  {isLoadingCaseDetails && selectedCase?.id === caseLaw.id ? (
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  ) : (
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                  )}
                                  View Full Case
                                </Button>
                              </div>

                              {/* GPT Reasoning Section */}
                              {/* {caseLaw.gpt_reasoning?.length > 0 && (
                                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                                  <h5 className="font-medium text-gray-800 mb-2">GPT Reasoning</h5>
                                  <ul className="list-disc list-inside space-y-1">
                                    {caseLaw.gpt_reasoning.map((reason, idx) => (
                                      <li key={idx} className="text-sm text-gray-700 whitespace-pre-line">
                                        {reason}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )} */}
                              <div>
  <button
    className="text-xs text-blue-600 underline"
    onMouseEnter={() => fetchSummary(caseLaw.doc_id)}
  >
    Hover for AI Summary
  </button>

  {loading[caseLaw.doc_id] && (
    <p className="text-xs text-gray-500 mt-1">Loading...</p>
  )}

  {summaries[caseLaw.doc_id] && (
    <p className="text-sm text-gray-700 mt-2">{summaries[caseLaw.doc_id]}</p>
  )}
</div>

                              {/* Highlight Section */}
                              {caseLaw.explainers?.highlight?.content?.length > 0 && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
                                  <h5 className="font-medium text-yellow-800 mb-2">Key Highlights</h5>
                                  <ul className="list-disc list-inside space-y-1">
                                    {caseLaw.explainers.highlight.content.map((hl, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-gray-800"
                                        dangerouslySetInnerHTML={{ __html: hl }}
                                      />
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </CardContent>


                        </Card>
                      ))}

                      {displayedCases.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No cases match your filters.</p>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Pagination */}
                  {relevantCases.totalResults > casesPerPage && (
                    <div className="flex justify-between items-center mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1 || isLoadingCases}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                        <span className="text-gray-500 ml-1">
                          (Showing {displayedCases.length} of {relevantCases.totalResults})
                        </span>
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages || isLoadingCases}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="statutes" className="h-full">
                <div className="p-4 h-full">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Relevant Statutes</h3>
                    <p className="text-sm text-gray-600">Kenyan laws applicable to {caseType}</p>
                  </div>
                  <ScrollArea className="h-full">
                    <div className="space-y-3">
                      {relevantStatutes.map((statute) => (
                        <Card key={statute.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{statute.title}</h4>
                                <p className="text-sm text-gray-600 font-medium">{statute.section}</p>
                                <p className="text-sm text-gray-500">{statute.chapter}</p>
                                <p className="text-sm text-gray-700 mt-2">{statute.content}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {Math.round(statute.relevance * 100)}% relevant
                                  </Badge>
                                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                                    <BookOpen className="h-3 w-3 mr-1" />
                                    View Statute
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="research" className="h-full">
                <div className="p-4 h-full">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Research Tools</h3>
                    <p className="text-sm text-gray-600">Advanced research features for {caseType}</p>
                  </div>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Search className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold">Search Kenya Law Database</h4>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Search for cases, statutes, or legal concepts..."
                            className="flex-1"
                          />
                          <Button>
                            Search
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Download className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold">Export Research</h4>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1">
                            <FileText className="h-4 w-4 mr-2" />
                            Export as PDF
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Research
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                          <h4 className="font-semibold">Legal Updates</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Get notified about recent changes in Kenyan law affecting {caseType}
                        </p>
                        <Button variant="outline" className="w-full">
                          Subscribe to Updates
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {caseData && (
          <Dialog open={!!caseData} onOpenChange={() => setCaseData(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
              <ScrollArea className="h-[80vh] p-0">
                <CaseDetailsDisplay
                  caseData={caseData}
                  isLoading={isLoadingCaseDetails}
                />
              </ScrollArea>
              <div className="border-t p-4 bg-gray-50 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCaseData(null)}
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Full Case Dialog */}
        {selectedCase && (
          <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <DialogHeader className="p-6 border-b bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
                      {selectedCase.title}
                    </DialogTitle>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Citation:</span> {selectedCase.citation}
                      </div>
                      <div>
                        <span className="font-medium">Case No:</span> {selectedCase.caseNumber || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Court:</span> {selectedCase.court}
                      </div>
                      <div>
                        <span className="font-medium">Date Delivered:</span> {selectedCase.dateDelivered || 'N/A'}
                      </div>
                    </div>
                    {selectedCase.judges && selectedCase.judges.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Judge(s):</span> {selectedCase.judges.join(', ')}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCase(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-hidden">
                <Tabs defaultValue="overview" className="h-full">
                  <div className="border-b">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="parties">Parties</TabsTrigger>
                      <TabsTrigger value="judgment">Judgment</TabsTrigger>
                      <TabsTrigger value="references">References</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="overview" className="h-full">
                    <ScrollArea className="h-[60vh] p-6">
                      <div className="space-y-6">
                        {/* Keywords */}
                        {selectedCase.keywords && selectedCase.keywords.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-2">Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedCase.keywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Headnotes */}
                        {selectedCase.headnotes && (
                          <div>
                            <h3 className="font-semibold mb-2">Headnotes</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {selectedCase.headnotes}
                            </p>
                          </div>
                        )}

                        {/* Summary */}
                        <div>
                          <h3 className="font-semibold mb-2">Summary</h3>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {selectedCase.summary}
                          </p>
                        </div>

                        {/* Relevance Score */}
                        <div>
                          <h3 className="font-semibold mb-2">Relevance Score</h3>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${selectedCase.relevance * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {Math.round(selectedCase.relevance * 100)}% relevant
                            </span>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="parties" className="h-full">
                    <ScrollArea className="h-[60vh] p-6">
                      <div className="space-y-4">
                        {selectedCase.parties && Object.keys(selectedCase.parties).length > 0 ? (
                          Object.entries(selectedCase.parties).map(([role, name]) => (
                            <div key={role} className="flex justify-between py-2 border-b">
                              <span className="font-medium capitalize">{role}:</span>
                              <span className="text-gray-700">{name}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">No party information available</p>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="judgment" className="h-full">
                    <ScrollArea className="h-[60vh] p-6">
                      <div className="prose prose-sm max-w-none">
                        {selectedCase.fullText ? (
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                            {selectedCase.fullText}
                          </pre>
                        ) : (
                          <p className="text-gray-500 italic">Full judgment text not available</p>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="references" className="h-full">
                    <ScrollArea className="h-[60vh] p-6">
                      <div className="space-y-6">
                        {/* Precedents */}
                        {selectedCase.precedents && selectedCase.precedents.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-3">Cases Cited</h3>
                            <ul className="space-y-2">
                              {selectedCase.precedents.map((precedent, index) => (
                                <li key={index} className="text-sm text-gray-700 pl-4 border-l-2 border-blue-200">
                                  {precedent}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Legislation */}
                        {selectedCase.legislation && selectedCase.legislation.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-3">Legislation Cited</h3>
                            <ul className="space-y-2">
                              {selectedCase.legislation.map((law, index) => (
                                <li key={index} className="text-sm text-gray-700 pl-4 border-l-2 border-green-200">
                                  {law}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {(!selectedCase.precedents || selectedCase.precedents.length === 0) &&
                          (!selectedCase.legislation || selectedCase.legislation.length === 0) && (
                            <p className="text-gray-500 italic">No references available</p>
                          )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Footer Actions */}
              <div className="border-t p-4 bg-gray-50 flex justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={selectedCase.id.startsWith('local-') ? 'default' : 'secondary'}>
                    {selectedCase.id.startsWith('local-') ? 'Local Case' : 'Online Case'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(selectedCase.citation)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Citation
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fullCaseText = `${selectedCase.title}\n${selectedCase.citation}\n\n${selectedCase.summary}${selectedCase.fullText ? '\n\n' + selectedCase.fullText : ''}`;
                      copyToClipboard(fullCaseText);
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export Case
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}