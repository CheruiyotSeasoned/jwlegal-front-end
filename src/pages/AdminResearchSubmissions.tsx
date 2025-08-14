import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/DachboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  FileText, 
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Send,
  Eye,
  Edit,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  Archive,
  Plus
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

const AdminResearchSubmissions = () => {
  const { hasRole, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  if (!hasRole(['admin'])) {
    return <Navigate to="/login" replace />;
  }

  const submissions = [
    {
      id: 1,
      user: {
        name: 'John Doe',
        email: 'john.doe@lawfirm.com',
        role: 'lawyer'
      },
      type: 'research',
      title: 'Contract Law Analysis Request',
      description: 'Need comprehensive analysis of digital contract enforcement in Kenya',
      status: 'pending',
      priority: 'high',
      submittedAt: new Date('2024-01-15'),
      deadline: new Date('2024-01-25'),
      areaOfLaw: 'Commercial Law',
      assignedTo: null,
      notes: ''
    },
    {
      id: 2,
      user: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@court.gov',
        role: 'judicial'
      },
      type: 'brief',
      title: 'Judicial Precedent Review',
      description: 'Request for legal brief on recent judicial precedent developments',
      status: 'in_progress',
      priority: 'medium',
      submittedAt: new Date('2024-01-10'),
      deadline: new Date('2024-01-20'),
      areaOfLaw: 'Constitutional Law',
      assignedTo: 'Admin Team',
      notes: 'Working on comprehensive analysis of recent precedents'
    },
    {
      id: 3,
      user: {
        name: 'Michael Chen',
        email: 'michael.chen@lawfirm.com',
        role: 'lawyer'
      },
      type: 'question',
      title: 'Property Rights Query',
      description: 'Clarification needed on land ownership transfer procedures',
      status: 'completed',
      priority: 'low',
      submittedAt: new Date('2024-01-05'),
      deadline: new Date('2024-01-15'),
      areaOfLaw: 'Property Law',
      assignedTo: 'Admin Team',
      notes: 'Response provided with detailed explanation of procedures'
    },
    {
      id: 4,
      user: {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@court.gov',
        role: 'judicial'
      },
      type: 'analysis',
      title: 'Evidence Admissibility Analysis',
      description: 'Request for analysis of evidence admissibility in criminal proceedings',
      status: 'pending',
      priority: 'urgent',
      submittedAt: new Date('2024-01-18'),
      deadline: new Date('2024-01-22'),
      areaOfLaw: 'Criminal Law',
      assignedTo: null,
      notes: ''
    }
  ];

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
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'lawyer': return 'bg-blue-100 text-blue-800';
      case 'judicial': return 'bg-purple-100 text-purple-800';
      case 'client': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || submission.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAssignSubmission = (submissionId: number, assignedTo: string) => {
    // Handle assignment logic
    console.log(`Assigning submission ${submissionId} to ${assignedTo}`);
  };

  const handleUpdateStatus = (submissionId: number, status: string) => {
    // Handle status update logic
    console.log(`Updating submission ${submissionId} status to ${status}`);
  };

  return (
    <DashboardLayout title="Research Submissions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Research Submissions</h1>
            <p className="text-muted-foreground">Manage and respond to research requests from users</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Response
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                  <p className="text-2xl font-bold">{submissions.length}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {submissions.filter(s => s.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {submissions.filter(s => s.status === 'in_progress').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {submissions.filter(s => s.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle>Research Submissions</CardTitle>
            <CardDescription>Manage and respond to research requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Submitted by</p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{submission.user.name}</p>
                            <Badge className={getRoleColor(submission.user.role)}>
                              {submission.user.role}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{submission.user.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Area of Law</p>
                          <p className="font-medium">{submission.areaOfLaw}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Deadline</p>
                          <p className="font-medium">{submission.deadline.toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{submission.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Submitted: {submission.submittedAt.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Assigned: {submission.assignedTo || 'Unassigned'}
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
                        Respond
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Assign
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminResearchSubmissions; 