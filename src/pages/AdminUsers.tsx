import { DashboardLayout } from '@/components/DachboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  UserCheck, 
  UserX,
  Building,
  Gavel,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { useState } from 'react';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - in real app this would come from API
  const users = [
    {
      id: 1,
      name: 'John Kamau',
      email: 'john.kamau@email.com',
      phone: '+254 700 123 456',
      role: 'general_public',
      status: 'active',
      location: 'Nairobi',
      registrationDate: '2024-01-15',
      lastActive: '2024-03-20',
      casesSubmitted: 3
    },
    {
      id: 2,
      name: 'Adv. Sarah Mwangi',
      email: 'sarah.mwangi@lawfirm.co.ke',
      phone: '+254 700 234 567',
      role: 'lawyer',
      status: 'active',
      location: 'Mombasa',
      registrationDate: '2024-01-10',
      lastActive: '2024-03-21',
      casesHandled: 23,
      rating: 4.8
    },
    {
      id: 3,
      name: 'Law Firm ABC',
      email: 'info@lawfirmabc.co.ke',
      phone: '+254 700 345 678',
      role: 'law_firm',
      status: 'active',
      location: 'Nairobi',
      registrationDate: '2024-01-05',
      lastActive: '2024-03-21',
      lawyersCount: 5,
      casesHandled: 45
    },
    {
      id: 4,
      name: 'Hon. James Ochieng',
      email: 'james.ochieng@judiciary.go.ke',
      phone: '+254 700 456 789',
      role: 'judicial_officer',
      status: 'active',
      location: 'Kisumu',
      registrationDate: '2024-01-20',
      lastActive: '2024-03-19',
      casesReviewed: 12
    },
    {
      id: 5,
      name: 'Mary Wanjiku',
      email: 'mary.wanjiku@email.com',
      phone: '+254 700 567 890',
      role: 'general_public',
      status: 'pending',
      location: 'Eldoret',
      registrationDate: '2024-03-18',
      lastActive: '2024-03-18',
      casesSubmitted: 0
    }
  ];

  const roleLabels = {
    general_public: 'General Public',
    lawyer: 'Lawyer',
    law_firm: 'Law Firm',
    judicial_officer: 'Judicial Officer'
  };

  const roleIcons = {
    general_public: User,
    lawyer: Gavel,
    law_firm: Building,
    judicial_officer: Shield
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <DashboardLayout title="User Management - Kenya Legal AI Guide">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">User Management</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage platform users, lawyers, and organizations
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add New User</span>
            <span className="sm:hidden">Add User</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="general_public">General Public</SelectItem>
                    <SelectItem value="lawyer">Lawyers</SelectItem>
                    <SelectItem value="law_firm">Law Firms</SelectItem>
                    <SelectItem value="judicial_officer">Judicial Officers</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <h3 className="font-medium text-sm sm:text-base truncate">{user.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {roleLabels[user.role as keyof typeof roleLabels]}
                        </Badge>
                        <Badge 
                          variant={
                            user.status === 'active' ? 'default' :
                            user.status === 'pending' ? 'secondary' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Joined: {user.registrationDate}</span>
                      </div>
                    </div>

                    {/* Role-specific information */}
                    {user.role === 'lawyer' && (
                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Cases Handled: {user.casesHandled}</span>
                        <span className="text-muted-foreground">Rating: ⭐ {user.rating}</span>
                      </div>
                    )}
                    {user.role === 'law_firm' && (
                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Lawyers: {user.lawyersCount}</span>
                        <span className="text-muted-foreground">Cases: {user.casesHandled}</span>
                      </div>
                    )}
                    {user.role === 'judicial_officer' && (
                      <div className="mt-3 text-sm text-muted-foreground">
                        Cases Reviewed: {user.casesReviewed}
                      </div>
                    )}
                    {user.role === 'general_public' && (
                      <div className="mt-3 text-sm text-muted-foreground">
                        Cases Submitted: {user.casesSubmitted}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Statistics
            </CardTitle>
            <CardDescription>Platform user distribution and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">Total Users</p>
                  <p className="text-xs text-muted-foreground">{users.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <UserCheck className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Active Users</p>
                  <p className="text-xs text-muted-foreground">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Building className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium text-sm">Law Firms</p>
                  <p className="text-xs text-muted-foreground">
                    {users.filter(u => u.role === 'law_firm').length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Gavel className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium text-sm">Lawyers</p>
                  <p className="text-xs text-muted-foreground">
                    {users.filter(u => u.role === 'lawyer').length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;