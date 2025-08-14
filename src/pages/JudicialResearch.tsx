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
  Gavel,
  Library,
  MessageSquare,
  Send,
  Bot,
  Plus,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Clock3,
  FileText as FileTextIcon
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

const JudicialResearch = () => {
  const { hasRole, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('research');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, type: 'bot', message: 'Hello! I\'m your judicial research assistant. How can I help you today?', timestamp: new Date() }
  ]);
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      type: 'research',
      title: 'Constitutional Interpretation Analysis',
      description: 'Request for comprehensive analysis of recent constitutional interpretation precedents',
      status: 'pending',
      submittedAt: new Date('2024-01-15'),
      priority: 'high'
    },
    {
      id: 2,
      type: 'brief',
      title: 'Judicial Precedent Review',
      description: 'Request for legal brief on recent judicial precedent developments',
      status: 'in_progress',
      submittedAt: new Date('2024-01-10'),
      priority: 'medium'
    },
    {
      id: 3,
      type: 'question',
      title: 'Evidence Admissibility Query',
      description: 'Clarification needed on evidence admissibility in criminal proceedings',
      status: 'completed',
      submittedAt: new Date('2024-01-05'),
      priority: 'low'
    }
  ]);

  if (!hasRole(['judicial'])) {
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
        message: 'Thank you for your judicial inquiry. I\'m analyzing the legal precedents and will provide you with relevant judicial guidance shortly.',
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
      title: 'Supreme Court Decision: Constitutional Interpretation',
      category: 'Constitutional Law',
      court: 'Supreme Court of Kenya',
      year: '2023',
      relevance: 98,
      summary: 'Landmark decision on constitutional interpretation and fundamental rights.',
      citations: 156,
      saved: true,
      tags: ['Constitutional Law', 'Fundamental Rights', 'Supreme Court'],
      judge: 'Chief Justice Martha Koome',
      impact: 'High'
    },
    {
      id: 2,
      title: 'Commercial Court: Digital Contract Enforcement',
      category: 'Commercial Law',
      court: 'Commercial Court',
      year: '2023',
      relevance: 92,
      summary: 'Precedent-setting case on digital contract enforcement and e-commerce law.',
      citations: 89,
      saved: false,
      tags: ['Commercial Law', 'Digital Contracts', 'E-commerce'],
      judge: 'Justice John Mativo',
      impact: 'Medium'
    },
    {
      id: 3,
      title: 'Environment Court: Land Dispute Resolution',
      category: 'Property Law',
      court: 'Environment and Land Court',
      year: '2023',
      relevance: 95,
      summary: 'Comprehensive ruling on land dispute resolution and environmental protection.',
      citations: 234,
      saved: true,
      tags: ['Property Law', 'Land Disputes', 'Environmental Law'],
      judge: 'Justice Oscar Angote',
      impact: 'High'
    },
    {
      id: 4,
      title: 'Criminal Division: Evidence Admissibility',
      category: 'Criminal Law',
      court: 'High Court Criminal Division',
      year: '2023',
      relevance: 88,
      summary: 'Important ruling on evidence admissibility in criminal proceedings.',
      citations: 67,
      saved: false,
      tags: ['Criminal Law', 'Evidence', 'Procedure'],
      judge: 'Justice Grace Ngenye',
      impact: 'Medium'
    }
  ];

  const databases = [
    {
      name: 'Kenya Law Reports',
      description: 'Official law reports and judgments',
      access: 'Full Access',
      cases: 25000,
      updated: 'Daily',
      type: 'Primary'
    },
    {
      name: 'East African Law Reports',
      description: 'Regional case law and precedents',
      access: 'Full Access',
      cases: 15000,
      updated: 'Weekly',
      type: 'Regional'
    },
    {
      name: 'International Law Database',
      description: 'Global legal precedents and treaties',
      access: 'Full Access',
      cases: 50000,
      updated: 'Monthly',
      type: 'International'
    },
    {
      name: 'Academic Legal Journals',
      description: 'Peer-reviewed legal research',
      access: 'Full Access',
      cases: 20000,
      updated: 'Quarterly',
      type: 'Academic'
    }
  ];

  const filteredResults = researchResults.filter(result => {
    const matchesSearch = result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || result.category.toLowerCase() === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout title="Legal Research">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Judicial Research</h1>
            <p className="text-muted-foreground">Access comprehensive legal databases and research tools</p>
          </div>
          <Button className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Saved Research
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="research">Research Tools</TabsTrigger>
            <TabsTrigger value="chat">AI Chat Assistant</TabsTrigger>
            <TabsTrigger value="submit">Submit Requests</TabsTrigger>
            <TabsTrigger value="submissions">My Submissions</TabsTrigger>
          </TabsList>

          {/* Research Tools Tab */}
          <TabsContent value="research" className="space-y-6">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle>Research Tools</CardTitle>
                <CardDescription>Search across judicial databases and case law</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search case law, precedents, or legal topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="constitutional law">Constitutional Law</SelectItem>
                      <SelectItem value="commercial law">Commercial Law</SelectItem>
                      <SelectItem value="property law">Property Law</SelectItem>
                      <SelectItem value="criminal law">Criminal Law</SelectItem>
                      <SelectItem value="family law">Family Law</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Database Access */}
            <Card>
              <CardHeader>
                <CardTitle>Judicial Databases</CardTitle>
                <CardDescription>Access to comprehensive legal resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {databases.map((database, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{database.name}</h3>
                          <p className="text-sm text-muted-foreground">{database.description}</p>
                        </div>
                        <Badge variant="default">
                          {database.access}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Cases</p>
                          <p className="font-medium">{database.cases.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Updated</p>
                          <p className="font-medium">{database.updated}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-medium">{database.type}</p>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" className="w-full">
                            Access
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Research Results */}
            <Card>
              <CardHeader>
                <CardTitle>Research Results</CardTitle>
                <CardDescription>Found {filteredResults.length} relevant cases and precedents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredResults.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{result.title}</h3>
                            <Badge variant="outline">{result.category}</Badge>
                            <Badge className={getImpactColor(result.impact)}>
                              {result.impact} Impact
                            </Badge>
                            {result.saved && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Bookmark className="h-3 w-3 mr-1" />
                                Saved
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Court</p>
                              <p className="font-medium">{result.court}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Judge</p>
                              <p className="font-medium">{result.judge}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Year</p>
                              <p className="font-medium">{result.year}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Citations</p>
                              <p className="font-medium">{result.citations}</p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">{result.summary}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {result.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              {result.relevance}% relevant
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              Highly cited
                            </span>
                            <span className="flex items-center gap-1">
                              <Gavel className="h-4 w-4" />
                              Judicial precedent
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Bookmark className="h-4 w-4" />
                            {result.saved ? 'Saved' : 'Save'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Research Tools */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Precedent Analysis
                  </CardTitle>
                  <CardDescription>Analyze case similarities and precedents</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Start Analysis
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Library className="h-4 w-4" />
                    Legal Library
                  </CardTitle>
                  <CardDescription>Access legal journals and publications</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Browse Library
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Research History
                  </CardTitle>
                  <CardDescription>View your recent research activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View History
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Chat Assistant Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Judicial Assistant
                </CardTitle>
                <CardDescription>Ask questions and get instant judicial guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex flex-col">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 border rounded-lg bg-muted/20">
                    {chatHistory.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background border'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleChatSubmit} className="flex gap-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask your judicial question..."
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submit Requests Tab */}
          <TabsContent value="submit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Submit Judicial Research Request
                </CardTitle>
                <CardDescription>Submit judicial questions, brief requests, or research inquiries to our admin team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Request Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select request type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="research">Judicial Research</SelectItem>
                          <SelectItem value="brief">Legal Brief</SelectItem>
                          <SelectItem value="question">Judicial Question</SelectItem>
                          <SelectItem value="analysis">Precedent Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input placeholder="Brief title for your judicial request" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea 
                      placeholder="Provide detailed description of your judicial research needs, specific questions, or precedent analysis requirements..."
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Area of Law</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select area of law" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="constitutional">Constitutional Law</SelectItem>
                          <SelectItem value="criminal">Criminal Law</SelectItem>
                          <SelectItem value="civil">Civil Law</SelectItem>
                          <SelectItem value="commercial">Commercial Law</SelectItem>
                          <SelectItem value="family">Family Law</SelectItem>
                          <SelectItem value="property">Property Law</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Deadline (Optional)</label>
                      <Input type="date" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Submit Request
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5" />
                  My Submissions
                </CardTitle>
                <CardDescription>Track the status of your judicial research requests and submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{submission.title}</h3>
                            <Badge variant="outline" className="capitalize">
                              {submission.type}
                            </Badge>
                            <Badge className={getStatusColor(submission.status)}>
                              {submission.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(submission.priority)}>
                              {submission.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">{submission.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Submitted: {submission.submittedAt.toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              Assigned to Admin
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Contact Admin
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default JudicialResearch; 