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
  Plus,
  Search,
  BookOpen,
  Scale,
  Users,
  Calendar,
  MessageSquare,
  DollarSign,
  Bell,
  TrendingUp,
  AlertCircle,
  Star,
  Download,
  Share,
  Edit,
  Eye
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

const UserDashboard = () => {
  const { hasRole, user, loading } = useAuth();

  const [notifications] = useState([
    { id: 1, message: 'New case assignment received', time: '5 min ago', unread: true },
    { id: 2, message: 'Client message in Case #TF-2024-001', time: '1 hour ago', unread: true },
    { id: 3, message: 'Research completed for Case #CD-2024-015', time: '2 hours ago', unread: false },
  ]);

  // Wait for user to load before deciding
  if (loading) {
    return <div className="p-6">Loading...</div>; 
  }

  // After loading, if still not logged in or no valid role
  if (!user || !hasRole(['lawyer', 'client', 'judicial'])) {
    return <Navigate to="/login" replace />;
  }

  // Role-specific content
  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'lawyer':
        return {
          title: 'Lawyer Dashboard',
          stats: [
            { title: 'Active Cases', value: '12', icon: FileText, color: 'text-blue-600', trend: '+2 this week' },
            { title: 'Pending Reviews', value: '5', icon: Clock, color: 'text-yellow-600', trend: '-1 today' },
            { title: 'Completed Today', value: '3', icon: CheckCircle, color: 'text-green-600', trend: '+1 yesterday' },
            { title: 'Revenue This Month', value: 'KSh 45,000', icon: DollarSign, color: 'text-purple-600', trend: '+12% vs last month' }
          ],
          quickActions: [
            { title: 'Review Case', icon: FileText, description: 'Review pending client cases', color: 'bg-blue-50 hover:bg-blue-100' },
            { title: 'Legal Research', icon: Search, description: 'Access legal databases', color: 'bg-green-50 hover:bg-green-100' },
            { title: 'Client Communication', icon: MessageSquare, description: 'Respond to client queries', color: 'bg-purple-50 hover:bg-purple-100' }
          ],
          performanceData: [
            { label: 'Case Resolution Rate', value: 85, color: 'bg-green-500' },
            { label: 'Client Satisfaction', value: 92, color: 'bg-blue-500' },
            { label: 'Research Efficiency', value: 78, color: 'bg-yellow-500' }
          ]
        };
      
      case 'client':
        return {
          title: 'Client Dashboard',
          stats: [
            { title: 'My Cases', value: '2', icon: FileText, color: 'text-blue-600', trend: '1 new this month' },
            { title: 'In Progress', value: '1', icon: Clock, color: 'text-yellow-600', trend: 'Updated 2 hours ago' },
            { title: 'Completed', value: '1', icon: CheckCircle, color: 'text-green-600', trend: 'Resolved last week' },
            { title: 'Messages', value: '3', icon: MessageSquare, color: 'text-purple-600', trend: '2 unread' }
          ],
          quickActions: [
            { title: 'Submit New Case', icon: Plus, description: 'Submit a new legal inquiry', color: 'bg-blue-50 hover:bg-blue-100' },
            { title: 'Track Cases', icon: Search, description: 'View case progress', color: 'bg-green-50 hover:bg-green-100' },
            { title: 'Contact Lawyer', icon: MessageSquare, description: 'Message your lawyer', color: 'bg-purple-50 hover:bg-purple-100' }
          ],
          performanceData: [
            { label: 'Case Progress', value: 65, color: 'bg-blue-500' },
            { label: 'Communication Response', value: 88, color: 'bg-green-500' },
            { label: 'Satisfaction Level', value: 95, color: 'bg-purple-500' }
          ]
        };
      
      case 'judicial':
        return {
          title: 'Judicial Dashboard',
          stats: [
            { title: 'Research Queries', value: '8', icon: BookOpen, color: 'text-blue-600', trend: '+3 this week' },
            { title: 'Precedents Found', value: '24', icon: Scale, color: 'text-yellow-600', trend: '5 new today' },
            { title: 'Cases Reviewed', value: '15', icon: CheckCircle, color: 'text-green-600', trend: '+2 yesterday' },
            { title: 'Scheduled Hearings', value: '6', icon: Calendar, color: 'text-purple-600', trend: 'Next: Tomorrow' }
          ],
          quickActions: [
            { title: 'Legal Research', icon: BookOpen, description: 'Access case law database', color: 'bg-blue-50 hover:bg-blue-100' },
            { title: 'Precedent Search', icon: Search, description: 'Find relevant precedents', color: 'bg-green-50 hover:bg-green-100' },
            { title: 'Case Analysis', icon: Scale, description: 'Analyze case details', color: 'bg-purple-50 hover:bg-purple-100' }
          ],
          performanceData: [
            { label: 'Research Accuracy', value: 94, color: 'bg-green-500' },
            { label: 'Case Processing Speed', value: 87, color: 'bg-blue-500' },
            { label: 'Precedent Relevance', value: 91, color: 'bg-purple-500' }
          ]
        };
      
      default:
        return { title: 'Dashboard', stats: [], quickActions: [], performanceData: [] };
    }
  };

  const { title, stats, quickActions, performanceData } = getRoleSpecificContent();

  const recentActivity = [
    { 
      action: user?.role === 'client' ? 'Case updated' : 'New case assigned', 
      description: 'Traffic violation case #TF-2024-001', 
      time: '2 hours ago',
      status: 'active',
      avatar: user?.role === 'client' ? 'JD' : 'JS',
      color: 'bg-blue-100'
    },
    { 
      action: user?.role === 'lawyer' ? 'Client response' : 'Lawyer response received', 
      description: 'Commercial dispute case #CD-2024-015', 
      time: '5 hours ago',
      status: 'pending',
      avatar: user?.role === 'lawyer' ? 'CD' : 'MS',
      color: 'bg-yellow-100'
    },
    { 
      action: 'Research completed', 
      description: 'Constitutional law precedent search', 
      time: '1 day ago',
      status: 'completed',
      avatar: 'RL',
      color: 'bg-green-100'
    }
  ];

  const cases = [
    {
      id: 'TF-2024-001',
      title: 'Traffic Violation Case',
      client: 'John Doe',
      lawyer: 'Advocate Jane Smith',
      status: 'In Progress',
      progress: 65,
      lastUpdate: '2 hours ago',
      priority: 'Medium'
    },
    {
      id: 'CD-2024-015',
      title: 'Commercial Dispute',
      client: 'ABC Corp',
      lawyer: 'Senior Advocate Mike',
      status: 'Completed',
      progress: 100,
      lastUpdate: '1 week ago',
      priority: 'High'
    }
  ];

  return (
    <DashboardLayout title={title}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header with Notifications */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Welcome back, {user?.name || 'User'}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notifications.filter(n => n.unread).length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {notifications.filter(n => n.unread).length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{metric.label}</span>
                    <span className="font-medium">{metric.value}%</span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              {user?.role === 'lawyer' && 'Manage your cases and client communications'}
              {user?.role === 'client' && 'Submit cases and track progress'}
              {user?.role === 'judicial' && 'Access legal research tools and case databases'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className={`h-20 sm:h-24 flex flex-col gap-2 ${action.color} border-0`}
                >
                  <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <div className="text-center">
                    <div className="font-medium text-sm sm:text-base">{action.title}</div>
                    <div className="text-xs opacity-70 hidden sm:block">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className={`text-xs ${activity.color}`}>
                        {activity.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                    <Badge 
                      variant={
                        activity.status === 'completed' ? 'default' :
                        activity.status === 'active' ? 'secondary' : 'outline'
                      }
                      className="text-xs flex-shrink-0"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cases/Matters */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {user?.role === 'lawyer' && 'Active Cases'}
                {user?.role === 'client' && 'My Legal Matters'}
                {user?.role === 'judicial' && 'Research Projects'}
              </CardTitle>
              <CardDescription>
                {user?.role === 'lawyer' && 'Overview of your active cases and client matters'}
                {user?.role === 'client' && 'Your submitted cases and their current status'}
                {user?.role === 'judicial' && 'Current research projects and case analysis'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cases.map((caseItem, index) => (
                  <div key={index} className="border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm sm:text-base">{caseItem.title}</h3>
                          <Badge variant={caseItem.priority === 'High' ? 'destructive' : 'secondary'} className="w-fit">
                            {caseItem.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {user?.role === 'client' ? `Assigned to: ${caseItem.lawyer}` : 
                           user?.role === 'lawyer' ? `Client: ${caseItem.client}` : 
                           `Case ID: ${caseItem.id}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last updated: {caseItem.lastUpdate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
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
                        <Badge variant={caseItem.status === 'Completed' ? 'default' : 'secondary'}>
                          {caseItem.status}
                        </Badge>
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

        {/* Notifications Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Recent Notifications
            </CardTitle>
            <CardDescription>Stay updated with important alerts and messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className={`flex items-center gap-3 p-3 rounded-lg ${notification.unread ? 'bg-blue-50 border border-blue-200' : 'bg-muted'}`}>
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${notification.unread ? 'bg-blue-500' : 'bg-muted-foreground'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                  {notification.unread && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">New</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;