import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/DachboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  BookOpen, 
  FileText, 
  Scale,
  Database,
  Filter,
  Download,
  Bookmark,
  Share,
  Clock,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  MessageSquare,
  Send,
  Bot,
  Plus,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Clock3,
  FileText as FileTextIcon,
  Users
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

const LawyerResearch = () => {
  const { hasRole, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('research');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, type: 'bot', message: 'Hello! I\'m your legal research assistant. How can I help you today?', timestamp: new Date() }
  ]);
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      type: 'research',
      title: 'Contract Law Analysis Request',
      description: 'Need comprehensive analysis of digital contract enforcement in Kenya',
      status: 'pending',
      submittedAt: new Date('2024-01-15'),
      priority: 'high'
    },
    {
      id: 2,
      type: 'brief',
      title: 'Criminal Defense Brief',
      description: 'Request for legal brief on recent criminal procedure amendments',
      status: 'in_progress',
      submittedAt: new Date('2024-01-10'),
      priority: 'medium'
    },
    {
      id: 3,
      type: 'question',
      title: 'Property Rights Query',
      description: 'Clarification needed on land ownership transfer procedures',
      status: 'completed',
      submittedAt: new Date('2024-01-05'),
      priority: 'low'
    }
  ]);

  if (!hasRole(['lawyer'])) {
    return <Navigate to="/login" replace />;
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatHistory.length + 1,
      type: 'user' as const,
      message: chatMessage,
      timestamp: new Date()
    };

    setChatHistory([...chatHistory, newMessage]);
    setChatMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: chatHistory.length + 2,
        type: 'bot' as const,
        message: 'Thank you for your question. I\'m analyzing the legal aspects and will provide you with relevant information shortly.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const researchResults = [
    {
      id: 1,
      title: 'Constitutional Law Precedent: Right to Fair Trial',
      category: 'Constitutional Law',
      court: 'Supreme Court of Kenya',
      year: '2023',
      relevance: 95,
      summary: 'Landmark case establishing the right to fair trial in criminal proceedings.',
      citations: 45,
      saved: true,
      tags: ['Criminal Law', 'Fair Trial', 'Constitutional Rights']
    },
    {
      id: 2,
      title: 'Commercial Law: Contract Enforcement in Digital Age',
      category: 'Commercial Law',
      court: 'High Court of Kenya',
      year: '2023',
      relevance: 88,
      summary: 'Analysis of contract enforcement mechanisms in e-commerce transactions.',
      citations: 32,
      saved: false,
      tags: ['Commercial Law', 'E-commerce', 'Contract Law']
    },
    {
      id: 3,
      title: 'Family Law: Child Custody Arrangements',
      category: 'Family Law',
      court: 'Family Court',
      year: '2022',
      relevance: 92,
      summary: 'Comprehensive guide to child custody determination factors.',
      citations: 67,
      saved: true,
      tags: ['Family Law', 'Child Custody', 'Divorce']
    },
    {
      id: 4,
      title: 'Property Law: Land Dispute Resolution',
      category: 'Property Law',
      court: 'Environment and Land Court',
      year: '2023',
      relevance: 85,
      summary: 'Modern approaches to land dispute resolution and title verification.',
      citations: 28,
      saved: false,
      tags: ['Property Law', 'Land Disputes', 'Title Verification']
    }
  ];

  const databases = [
    {
      name: 'Kenya Law Reports',
      description: 'Official law reports and judgments',
      access: 'Premium',
      cases: 15000,
      updated: 'Daily'
    },
    {
      name: 'East African Law Reports',
      description: 'Regional case law and precedents',
      access: 'Premium',
      cases: 8500,
      updated: 'Weekly'
    },
    {
      name: 'International Law Database',
      description: 'Global legal precedents and treaties',
      access: 'Standard',
      cases: 25000,
      updated: 'Monthly'
    },
    {
      name: 'Legal Journals',
      description: 'Academic legal research and articles',
      access: 'Standard',
      cases: 12000,
      updated: 'Quarterly'
    }
  ];

  const filteredResults = researchResults.filter(result => {
    const matchesSearch = result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || result.category.toLowerCase() === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout title="Legal Research">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Legal Research</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Access Kenya legal databases and case law research tools
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Filter Results</span>
              <span className="sm:hidden">Filter</span>
            </Button>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New Research</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search case law, statutes, or legal precedents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="constitutional law">Constitutional Law</SelectItem>
                    <SelectItem value="commercial law">Commercial Law</SelectItem>
                    <SelectItem value="family law">Family Law</SelectItem>
                    <SelectItem value="property law">Property Law</SelectItem>
                    <SelectItem value="criminal law">Criminal Law</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full sm:w-auto">
                  <Search className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Search</span>
                  <span className="sm:hidden">Go</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Research Queries</CardTitle>
              <Search className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cases Found</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">
                Relevant cases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">
                Search accuracy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">1.2s</div>
              <p className="text-xs text-muted-foreground">
                Average search
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Research */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Research
            </CardTitle>
            <CardDescription>
              Your recent legal research queries and findings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {researchResults.map((research, index) => (
                <div key={index} className="border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-medium text-sm sm:text-base truncate">{research.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="w-fit text-xs">
                            {research.category}
                          </Badge>
                          <Badge variant={research.saved ? 'default' : 'secondary'} className="w-fit text-xs">
                            {research.saved ? 'Saved' : 'Not Saved'}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Date: {research.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>Relevance: {research.relevance}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          <span>Citations: {research.citations}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {research.summary && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">{research.summary}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Research Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Quick Research Tools
            </CardTitle>
            <CardDescription>
              Access specialized legal research tools and databases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-2">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Case Law</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-2">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Statutes</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-2">
                <Scale className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Precedents</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-2">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Expert Opinions</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-2">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Trends</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-2">
                <Star className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Favorites</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LawyerResearch; 