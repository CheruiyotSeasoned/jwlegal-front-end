import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/DachboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  FileText,
  MapPin
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

const LawyerClients = () => {
  const { hasRole, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!hasRole(['lawyer'])) {
    return <Navigate to="/login" replace />;
  }

  const clients = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+254 700 123 456',
      status: 'Active',
      cases: 2,
      totalRevenue: 25000,
      lastContact: '2 hours ago',
      nextMeeting: '2024-01-15',
      avatar: 'JD',
      category: 'Individual',
      address: 'Nairobi, Kenya',
      notes: 'Traffic violation case in progress. Client is cooperative.',
      recentActivity: [
        { action: 'Case update sent', time: '2 hours ago' },
        { action: 'Document uploaded', time: '1 day ago' },
        { action: 'Meeting scheduled', time: '2 days ago' }
      ]
    },
    {
      id: 2,
      name: 'ABC Corporation',
      email: 'legal@abccorp.com',
      phone: '+254 700 789 012',
      status: 'Active',
      cases: 1,
      totalRevenue: 75000,
      lastContact: '1 week ago',
      nextMeeting: 'N/A',
      avatar: 'AC',
      category: 'Corporate',
      address: 'Westlands, Nairobi',
      notes: 'Commercial dispute successfully resolved. Client satisfied.',
      recentActivity: [
        { action: 'Case completed', time: '1 week ago' },
        { action: 'Final documents sent', time: '1 week ago' },
        { action: 'Payment received', time: '2 weeks ago' }
      ]
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+254 700 345 678',
      status: 'Pending',
      cases: 1,
      totalRevenue: 35000,
      lastContact: '3 days ago',
      nextMeeting: '2024-01-20',
      avatar: 'SJ',
      category: 'Individual',
      address: 'Mombasa, Kenya',
      notes: 'Family law matter. Divorce proceedings with custody arrangements.',
      recentActivity: [
        { action: 'Documents requested', time: '3 days ago' },
        { action: 'Initial consultation', time: '1 week ago' },
        { action: 'Case filed', time: '2 weeks ago' }
      ]
    },
    {
      id: 4,
      name: 'Mike Wilson',
      email: 'mike.w@email.com',
      phone: '+254 700 901 234',
      status: 'Active',
      cases: 1,
      totalRevenue: 50000,
      lastContact: '1 day ago',
      nextMeeting: '2024-01-18',
      avatar: 'MW',
      category: 'Individual',
      address: 'Eldoret, Kenya',
      notes: 'Criminal defense case. Preparing for trial.',
      recentActivity: [
        { action: 'Evidence review', time: '1 day ago' },
        { action: 'Witness statement taken', time: '3 days ago' },
        { action: 'Bail application filed', time: '1 week ago' }
      ]
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Corporate': return 'bg-blue-100 text-blue-800';
      case 'Individual': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout title="Client Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Client Management</h1>
            <p className="text-muted-foreground">Manage your client relationships and communications</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground">Active clients</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.filter(c => c.status === 'Active').length}</div>
              <p className="text-xs text-muted-foreground">Currently engaged</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSh {clients.reduce((sum, c) => sum + c.totalRevenue, 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Follow-ups needed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter your clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clients List */}
        <div className="space-y-4">
          {filteredClients.map((client, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-sm font-medium">
                        {client.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{client.name}</h3>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                        <Badge className={getCategoryColor(client.category)}>
                          {client.category}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{client.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{client.phone}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{client.address}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{client.cases} case(s)</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{client.notes}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          KSh {client.totalRevenue.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Next: {client.nextMeeting === 'N/A' ? 'No meeting' : client.nextMeeting}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Last contact: {client.lastContact}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
                  <div className="space-y-2">
                    {client.recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{activity.action}</span>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LawyerClients; 