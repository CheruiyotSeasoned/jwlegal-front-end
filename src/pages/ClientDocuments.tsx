import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DachboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter,
  Folder,
  Eye,
  Share,
  Trash2,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  File,
  Image,
  FileVideo,
  FileAudio
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'audio' | 'other';
  size: string;
  uploadedBy: string;
  uploadedDate: Date;
  caseTitle: string;
  category: 'contract' | 'evidence' | 'correspondence' | 'court-filing' | 'billing' | 'other';
  status: 'shared' | 'private' | 'archived';
  description: string;
  isShared: boolean;
}

const ClientDocuments = () => {
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Mock data
  const documents: Document[] = [
    {
      id: '1',
      name: 'Employment Contract.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'Attorney Sarah Wilson',
      uploadedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      caseTitle: 'Employment Discrimination Case',
      category: 'contract',
      status: 'shared',
      description: 'Original employment contract with company policies',
      isShared: true
    },
    {
      id: '2',
      name: 'Discrimination Evidence.docx',
      type: 'doc',
      size: '1.8 MB',
      uploadedBy: 'You',
      uploadedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      caseTitle: 'Employment Discrimination Case',
      category: 'evidence',
      status: 'shared',
      description: 'Documentation of discriminatory incidents and timeline',
      isShared: true
    },
    {
      id: '3',
      name: 'Court Filing - Motion.pdf',
      type: 'pdf',
      size: '3.2 MB',
      uploadedBy: 'Attorney Sarah Wilson',
      uploadedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      caseTitle: 'Employment Discrimination Case',
      category: 'court-filing',
      status: 'shared',
      description: 'Motion for summary judgment filed with the court',
      isShared: true
    },
    {
      id: '4',
      name: 'Settlement Offer.pdf',
      type: 'pdf',
      size: '1.5 MB',
      uploadedBy: 'Attorney David Rodriguez',
      uploadedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      caseTitle: 'Contract Dispute Resolution',
      category: 'correspondence',
      status: 'shared',
      description: 'Initial settlement offer from opposing party',
      isShared: true
    },
    {
      id: '5',
      name: 'Invoice - Legal Services.pdf',
      type: 'pdf',
      size: '0.8 MB',
      uploadedBy: 'Legal Assistant Mike Chen',
      uploadedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      caseTitle: 'Employment Discrimination Case',
      category: 'billing',
      status: 'private',
      description: 'Invoice for legal services rendered',
      isShared: false
    },
    {
      id: '6',
      name: 'Meeting Notes.docx',
      type: 'doc',
      size: '0.5 MB',
      uploadedBy: 'You',
      uploadedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
      caseTitle: 'Employment Discrimination Case',
      category: 'correspondence',
      status: 'private',
      description: 'Personal notes from client consultation meeting',
      isShared: false
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'image': return <Image className="h-5 w-5 text-green-500" />;
      case 'video': return <FileVideo className="h-5 w-5 text-purple-500" />;
      case 'audio': return <FileAudio className="h-5 w-5 text-orange-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contract': return 'bg-blue-100 text-blue-800';
      case 'evidence': return 'bg-green-100 text-green-800';
      case 'correspondence': return 'bg-purple-100 text-purple-800';
      case 'court-filing': return 'bg-red-100 text-red-800';
      case 'billing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shared': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'private': return <User className="h-4 w-4 text-blue-500" />;
      case 'archived': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTotalSize = () => {
    return documents.reduce((total, doc) => {
      const size = parseFloat(doc.size.split(' ')[0]);
      return total + size;
    }, 0);
  };

  const getSharedDocuments = () => {
    return documents.filter(doc => doc.isShared);
  };

  const getRecentDocuments = () => {
    return documents
      .sort((a, b) => b.uploadedDate.getTime() - a.uploadedDate.getTime())
      .slice(0, 5);
  };

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || document.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!hasRole(['client'])) {
    return (
      <DashboardLayout title="Documents">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Access denied. This page is for clients only.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Documents">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-muted-foreground">Manage your case documents and files</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                  <p className="text-2xl font-bold">{documents.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shared</p>
                  <p className="text-2xl font-bold">{getSharedDocuments().length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                  <p className="text-2xl font-bold">{getTotalSize().toFixed(1)} MB</p>
                </div>
                <Folder className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recent</p>
                  <p className="text-2xl font-bold">{getRecentDocuments().length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Documents</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="contract">Contracts</SelectItem>
                        <SelectItem value="evidence">Evidence</SelectItem>
                        <SelectItem value="correspondence">Correspondence</SelectItem>
                        <SelectItem value="court-filing">Court Filings</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedDocument(document)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getFileIcon(document.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{document.name}</h3>
                              {document.isShared && (
                                <Badge variant="outline" className="text-xs">
                                  Shared
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{document.caseTitle}</p>
                            <p className="text-sm text-muted-foreground mb-2">{document.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{document.uploadedBy}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(document.uploadedDate)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span>{document.size}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(document.status)}
                            <Badge className={getCategoryColor(document.category)}>
                              {document.category}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getRecentDocuments().map((document) => (
                    <div key={document.id} className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(document.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{document.name}</p>
                          <p className="text-xs text-muted-foreground">{document.caseTitle}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(document.uploadedDate)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Folder className="h-4 w-4 mr-2" />
                    Create Folder
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['contract', 'evidence', 'correspondence', 'court-filing', 'billing', 'other'].map((category) => {
                    const count = documents.filter(doc => doc.category === category).length;
                    return (
                      <div key={category} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(category)}>
                            {category}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Document Details Dialog */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Document Details</h2>
                <Button variant="ghost" onClick={() => setSelectedDocument(null)}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {getFileIcon(selectedDocument.type)}
                  <div>
                    <h3 className="font-semibold">{selectedDocument.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedDocument.caseTitle}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Size</span>
                    <span className="text-sm font-medium">{selectedDocument.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Uploaded By</span>
                    <span className="text-sm font-medium">{selectedDocument.uploadedBy}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Upload Date</span>
                    <span className="text-sm font-medium">{formatDate(selectedDocument.uploadedDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <Badge className={getCategoryColor(selectedDocument.category)}>
                      {selectedDocument.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedDocument.status)}
                      <span className="text-sm font-medium">{selectedDocument.status}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Description</p>
                  <p className="text-sm text-muted-foreground">{selectedDocument.description}</p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientDocuments; 