import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/DachboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  MessageSquare,
  Calendar,
  Download,
  Eye,
  Phone,
  Mail,
  AlertCircle,
  Star,
  Users,
  DollarSign,
  MapPin,
  Filter,
  Plus,
  Share
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

const ClientCases = () => {
  const { hasRole, user } = useAuth();

  if (!hasRole(['client'])) {
    return <Navigate to="/login" replace />;
  }

  const cases = [
    {
      id: 'TF-2024-001',
      title: 'Traffic Violation Case',
      lawyer: 'Advocate Jane Smith',
      lawyerEmail: 'jane.smith@lawfirm.com',
      lawyerPhone: '+254 700 123 456',
      status: 'In Progress',
      progress: 65,
      lastUpdate: '2 hours ago',
      nextHearing: '2024-01-15',
      category: 'Traffic Law',
      description: 'Speeding violation case. Working on plea bargain with prosecutor.',
      documents: 8,
      messages: 12,
      fees: 25000,
      paid: 15000,
      court: 'Traffic Court, Nairobi',
      caseNumber: 'TF-2024-001',
      priority: 'High',
      filedDate: '2023-12-01',
      cost: 25000
    },
    {
      id: 'CD-2024-015',
      title: 'Commercial Dispute',
      lawyer: 'Senior Advocate Mike Johnson',
      lawyerEmail: 'mike.johnson@lawfirm.com',
      lawyerPhone: '+254 700 789 012',
      status: 'Completed',
      progress: 100,
      lastUpdate: '1 week ago',
      nextHearing: 'N/A',
      category: 'Commercial Law',
      description: 'Contract dispute with business partner. Successfully resolved through mediation.',
      documents: 15,
      messages: 8,
      fees: 75000,
      paid: 75000,
      court: 'Commercial Court, Nairobi',
      caseNumber: 'CD-2024-015',
      priority: 'Medium',
      filedDate: '2024-01-05',
      cost: 75000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Traffic Law': return 'bg-orange-100 text-orange-800';
      case 'Commercial Law': return 'bg-purple-100 text-purple-800';
      case 'Family Law': return 'bg-pink-100 text-pink-800';
      case 'Criminal Law': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCases = cases.map(c => ({
    ...c,
    lastUpdate: c.lastUpdate.replace(' ago', ''),
    filedDate: c.filedDate.replace('2024-', ''),
    cost: c.fees
  }));

  return (
    <DashboardLayout title="My Cases">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">My Cases</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Track the progress of your legal matters
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
              <span className="hidden sm:inline">Submit New Case</span>
              <span className="sm:hidden">New Case</span>
            </Button>
          </div>
        </div>

        {/* Case Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{cases.length}</div>
              <p className="text-xs text-muted-foreground">
                Submitted cases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {cases.filter(c => c.status === 'In Progress').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Active cases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {cases.filter(c => c.status === 'Completed').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Resolved cases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                KSh {cases.reduce((sum, c) => sum + c.cost, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Legal fees
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cases List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              My Legal Matters
            </CardTitle>
            <CardDescription>
              Your submitted cases and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCases.map((caseItem, index) => (
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
                          <span>Lawyer: {caseItem.lawyer}</span>
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
                        <Download className="h-4 w-4" />
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
                        <span className="text-sm text-muted-foreground">Cost:</span>
                        <span className="text-sm font-medium">KSh {caseItem.cost.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Share className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Star className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Recent Messages
              </CardTitle>
              <CardDescription>Latest communications with your lawyers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">JS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Advocate Jane Smith</p>
                    <p className="text-xs text-muted-foreground">Case update sent - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">MJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Senior Advocate Mike</p>
                    <p className="text-xs text-muted-foreground">Document review completed - 1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Court dates and appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Traffic Court Hearing</p>
                    <p className="text-xs text-muted-foreground">January 15, 2024 - 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Users className="h-4 w-4 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Meeting with Lawyer</p>
                    <p className="text-xs text-muted-foreground">January 12, 2024 - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Payment Status
              </CardTitle>
              <CardDescription>Track your legal fees and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Fees</span>
                  <span className="text-sm font-medium">KSh {cases.reduce((sum, c) => sum + c.fees, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Paid</span>
                  <span className="text-sm font-medium text-green-600">
                    KSh {cases.reduce((sum, c) => sum + c.paid, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Outstanding</span>
                  <span className="text-sm font-medium text-red-600">
                    KSh {(cases.reduce((sum, c) => sum + c.fees, 0) - cases.reduce((sum, c) => sum + c.paid, 0)).toLocaleString()}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Make Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientCases; 