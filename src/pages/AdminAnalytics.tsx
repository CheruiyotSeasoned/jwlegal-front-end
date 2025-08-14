import { DashboardLayout } from '@/components/DachboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Star, 
  Clock, 
  DollarSign,
  Gavel,
  Shield,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  MapPin,
  Activity
} from 'lucide-react';
import { useState } from 'react';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalCases: 1247,
      activeCases: 156,
      completedCases: 1091,
      totalUsers: 2847,
      activeLawyers: 89,
      averageRating: 4.2,
      aiAccuracy: 94.2,
      responseTime: '2.3hrs'
    },
    caseCategories: [
      { category: 'Traffic', count: 445, percentage: 35.7, trend: '+12%' },
      { category: 'Criminal', count: 338, percentage: 27.1, trend: '+8%' },
      { category: 'Civil', count: 352, percentage: 28.2, trend: '+15%' },
      { category: 'Constitutional', count: 112, percentage: 9.0, trend: '+5%' }
    ],
    topLawyers: [
      { name: 'Adv. Sarah Mwangi', rating: 4.8, cases: 23, responseTime: '1.8hrs', specialization: 'Criminal' },
      { name: 'Adv. James Ochieng', rating: 4.5, cases: 18, responseTime: '2.1hrs', specialization: 'Civil' },
      { name: 'Adv. Mary Wanjiku', rating: 4.2, cases: 15, responseTime: '2.4hrs', specialization: 'Traffic' },
      { name: 'Adv. Peter Kimani', rating: 4.0, cases: 12, responseTime: '3.2hrs', specialization: 'Constitutional' }
    ],
    aiPerformance: {
      accuracyByCategory: [
        { category: 'Traffic', accuracy: 96.5, confidence: 0.92 },
        { category: 'Criminal', accuracy: 93.2, confidence: 0.89 },
        { category: 'Civil', accuracy: 94.8, confidence: 0.91 },
        { category: 'Constitutional', accuracy: 91.5, confidence: 0.87 }
      ],
      responseTimeTrend: [
        { date: '2024-03-15', avgTime: 2.1 },
        { date: '2024-03-16', avgTime: 2.3 },
        { date: '2024-03-17', avgTime: 2.0 },
        { date: '2024-03-18', avgTime: 2.4 },
        { date: '2024-03-19', avgTime: 2.2 },
        { date: '2024-03-20', avgTime: 2.1 },
        { date: '2024-03-21', avgTime: 2.3 }
      ]
    },
    regionalData: [
      { region: 'Nairobi', cases: 456, lawyers: 34, avgRating: 4.3 },
      { region: 'Mombasa', cases: 234, lawyers: 18, avgRating: 4.1 },
      { region: 'Kisumu', cases: 189, lawyers: 12, avgRating: 4.4 },
      { region: 'Eldoret', cases: 156, lawyers: 8, avgRating: 4.0 },
      { region: 'Nakuru', cases: 123, lawyers: 7, avgRating: 4.2 },
      { region: 'Other', cases: 89, lawyers: 10, avgRating: 4.1 }
    ],
    complianceMetrics: {
      dpaCompliance: 100,
      kenyaIpAccess: 98.5,
      lskCompliance: 100,
      dataEncryption: 100,
      auditLogs: 100
    }
  };

  return (
    <DashboardLayout title="Analytics - Kenya Legal AI Guide">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Analytics Dashboard</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Comprehensive analytics for the Kenya Legal AI Guide platform
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto">
              <Activity className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{analyticsData.overview.totalCases.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-600">+15%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{analyticsData.overview.aiAccuracy}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-600">+2.1%</span> improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{analyticsData.overview.responseTime}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-600">-0.3hrs</span> faster
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lawyer Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{analyticsData.overview.averageRating}/5</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-600">+0.2</span> improvement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Case Categories & AI Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Case Categories
              </CardTitle>
              <CardDescription>Distribution of cases by legal category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.caseCategories.map((category) => (
                  <div key={category.category} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0"></div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{category.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {category.count} cases ({category.percentage}%)
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs w-fit">
                      {category.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                AI Performance by Category
              </CardTitle>
              <CardDescription>AI accuracy across legal categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.aiPerformance.accuracyByCategory.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm font-medium">{item.accuracy}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Confidence: {(item.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Lawyers & Regional Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Performing Lawyers
              </CardTitle>
              <CardDescription>Best rated lawyers this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topLawyers.map((lawyer, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-medium text-sm sm:text-base truncate">{lawyer.name}</h3>
                        <Badge variant="outline" className="w-fit text-xs">
                          {lawyer.specialization}
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Regional Performance
              </CardTitle>
              <CardDescription>Case distribution by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.regionalData.map((region, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-medium text-sm sm:text-base truncate">{region.region}</h3>
                        <Badge variant="outline" className="w-fit text-xs">
                          {region.cases} cases
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Lawyers: {region.lawyers}</span>
                        <span>Rating: {region.avgRating}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Compliance & Security Metrics
            </CardTitle>
            <CardDescription>Platform compliance and security status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">DPA Compliance</p>
                  <p className="text-xs text-muted-foreground">{analyticsData.complianceMetrics.dpaCompliance}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Kenya IP Access</p>
                  <p className="text-xs text-muted-foreground">{analyticsData.complianceMetrics.kenyaIpAccess}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">LSK Compliance</p>
                  <p className="text-xs text-muted-foreground">{analyticsData.complianceMetrics.lskCompliance}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Data Encryption</p>
                  <p className="text-xs text-muted-foreground">{analyticsData.complianceMetrics.dataEncryption}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Audit Logs</p>
                  <p className="text-xs text-muted-foreground">{analyticsData.complianceMetrics.auditLogs}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;