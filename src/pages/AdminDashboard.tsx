import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/DachboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Settings,
  Shield,
  Database,
  BarChart3,
  Gavel,
  Star,
  Globe,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { hasRole } = useAuth();

  if (!hasRole(['admin', 'super_admin'])) {
    return <Navigate to="/login" replace />;
  }

  const stats = [
    { title: 'Total Users', value: '0', icon: Users, change: '+15%', color: 'text-blue-600' },
    { title: 'Active Cases', value: '0', icon: FileText, change: '+8%', color: 'text-green-600' },
    { title: 'Lawyer Rating', value: '0/0', icon: Star, change: '+0.3', color: 'text-yellow-600' },
    { title: 'Kenya IP Access', value: '0%', icon: Globe, change: '+2.1%', color: 'text-purple-600' }
  ];

  const caseStats = [
    { category: 'Traffic', count: 45, pending: 12, completed: 33 },
    { category: 'Criminal', count: 38, pending: 8, completed: 30 },
    { category: 'Civil', count: 52, pending: 15, completed: 37 },
    { category: 'Constitutional', count: 21, pending: 5, completed: 16 }
  ];

  const recentActivity = [
    { action: 'New lawyer registration', user: 'Adv. Sarah Mwangi', time: '2 hours ago', status: 'pending', type: 'lawyer' },
    { action: 'Case submitted - Traffic', user: 'John Kamau', time: '4 hours ago', status: 'active', type: 'case' },
    { action: 'Payment processed - Gold Tier', user: 'Law Firm ABC', time: '6 hours ago', status: 'completed', type: 'payment' },
    { action: 'Legal vetting completed', user: 'Adv. James Ochieng', time: '8 hours ago', status: 'completed', type: 'vetting' },
    { action: 'DPA compliance check', user: 'System', time: '12 hours ago', status: 'completed', type: 'compliance' }
  ];

  const lawyerPerformance = [
    { name: 'Adv. Sarah Mwangi', rating: 4.8, cases: 23, responseTime: '2.3hrs', status: 'active' },
    { name: 'Adv. James Ochieng', rating: 4.5, cases: 18, responseTime: '3.1hrs', status: 'active' },
    { name: 'Adv. Mary Wanjiku', rating: 4.2, cases: 15, responseTime: '4.2hrs', status: 'active' },
    { name: 'Adv. Peter Kimani', rating: 3.9, cases: 12, responseTime: '5.8hrs', status: 'review' }
  ];

  return (
    <DashboardLayout title="Admin Dashboard - Kenya Legal AI Guide">
      <div className="space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Case Categories Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Case Categories Overview
            </CardTitle>
            <CardDescription>
              Distribution of cases by legal category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {caseStats.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.category}</span>
                    <Badge variant="outline">{category.count}</Badge>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Pending: {category.pending}</span>
                    <span>Completed: {category.completed}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(category.completed / category.count) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Manage system settings and legal operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-16 sm:h-20 flex flex-col gap-2">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">User Management</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-2">
                <Star className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Lawyer Ratings</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-2">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">DPA Compliance</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-2">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Pricing Tiers</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lawyer Performance & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Lawyer Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Lawyer Performance
              </CardTitle>
              <CardDescription>
                Performance metrics for registered lawyers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lawyerPerformance.map((lawyer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-medium text-sm sm:text-base truncate">{lawyer.name}</h3>
                        <Badge 
                          variant={lawyer.status === 'active' ? 'default' : 'secondary'}
                          className="w-fit text-xs"
                        >
                          {lawyer.status}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Rating: {lawyer.rating}/5</span>
                        <span>Cases: {lawyer.cases}</span>
                        <span>Response: {lawyer.responseTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest system activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.status === 'completed' ? 'bg-green-500' :
                      activity.status === 'active' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <p className="text-sm font-medium truncate">{activity.action}</p>
                        <Badge 
                          variant={
                            activity.status === 'completed' ? 'default' :
                            activity.status === 'active' ? 'secondary' : 'outline'
                          }
                          className="w-fit text-xs"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{activity.user}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Health & Compliance
            </CardTitle>
            <CardDescription>
              Platform security and regulatory compliance status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">DPA Compliance</p>
                  <p className="text-xs text-muted-foreground">100% Compliant</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">LSK Standards</p>
                  <p className="text-xs text-muted-foreground">Fully Compliant</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Data Encryption</p>
                  <p className="text-xs text-muted-foreground">AES-256 Active</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Audit Logs</p>
                  <p className="text-xs text-muted-foreground">Real-time Tracking</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;