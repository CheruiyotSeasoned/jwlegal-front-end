import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/DachboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Plus,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Download,
  Share,
  Calendar,
  DollarSign,
  AlertCircle,
  Star,
  Users,
  Scale,
  Edit
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

const LawyerCases = () => {
  const { hasRole, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  if (!hasRole(['lawyer'])) {
    return <Navigate to="/login" replace />;
  }

  const cases = [
    {
      id: 'TF-2024-001',
      title: 'Traffic Violation Case',
      client: 'John Doe',
      clientEmail: 'john.doe@email.com',
      status: 'In Progress',
      priority: 'Medium',
      progress: 65,
      lastUpdate: '2 hours ago',
      nextHearing: '2024-01-15',
      revenue: 25000,
      category: 'Traffic Law',
      description: 'Client charged with speeding violation. Working on plea bargain.',
      documents: 8,
      messages: 12,
      filedDate: '2023-12-01'
    },
    {
      id: 'CD-2024-015',
      title: 'Commercial Dispute',
      client: 'ABC Corp',
      clientEmail: 'legal@abccorp.com',
      status: 'Completed',
      priority: 'High',
      progress: 100,
      lastUpdate: '1 week ago',
      nextHearing: 'N/A',
      revenue: 75000,
      category: 'Commercial Law',
      description: 'Contract dispute between ABC Corp and XYZ Ltd. Successfully resolved.',
      documents: 15,
      messages: 8,
      filedDate: '2023-11-20'
    },
    {
      id: 'FL-2024-008',
      title: 'Family Law Matter',
      client: 'Sarah Johnson',
      clientEmail: 'sarah.j@email.com',
      status: 'Pending',
      priority: 'High',
      progress: 25,
      lastUpdate: '3 days ago',
      nextHearing: '2024-01-20',
      revenue: 35000,
      category: 'Family Law',
      description: 'Divorce proceedings with child custody arrangements.',
      documents: 12,
      messages: 5,
      filedDate: '2023-12-10'
    },
    {
      id: 'CR-2024-003',
      title: 'Criminal Defense',
      client: 'Mike Wilson',
      clientEmail: 'mike.w@email.com',
      status: 'In Progress',
      priority: 'High',
      progress: 45,
      lastUpdate: '1 day ago',
      nextHearing: '2024-01-18',
      revenue: 50000,
      category: 'Criminal Law',
      description: 'Assault charges defense. Preparing for trial.',
      documents: 20,
      messages: 15,
      filedDate: '2023-12-20'
    }
  ];

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || caseItem.status.toLowerCase() === statusFilter;
    const matchesPriority = priorityFilter === 'all' || caseItem.priority.toLowerCase() === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout title="My Cases">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">My Cases</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your active cases and client matters
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Filter Cases</span>
              <span className="sm:hidden">Filter</span>
            </Button>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New Case</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Case Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Currently handling
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">KSh 45K</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter your cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cases..."
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
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
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

        {/* Cases List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Active Cases
            </CardTitle>
            <CardDescription>
              Your current cases and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cases.map((caseItem, index) => (
                <div key={index} className="border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-medium text-sm sm:text-base truncate">{caseItem.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={caseItem.priority === 'High' ? 'destructive' : 'secondary'} className="w-fit">
                            {caseItem.priority}
                          </Badge>
                          <Badge variant={caseItem.status === 'In Progress' ? 'default' : 'secondary'} className="w-fit">
                            {caseItem.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Client: {caseItem.client}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Filed: {caseItem.filedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Last updated: {caseItem.lastUpdate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{caseItem.progress}%</span>
                    </div>
                    <Progress value={caseItem.progress} className="h-2" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Next hearing:</span>
                        <span className="text-sm font-medium">{caseItem.nextHearing}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="h-3 w-3" />
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
    </DashboardLayout>
  );
};

export default LawyerCases; 