import { DashboardLayout } from '@/components/DachboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  FileText, 
  Download, 
  Upload, 
  RefreshCw, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  Network,
  Users,
  Gavel,
  Search,
  Filter,
  Archive,
  Trash2,
  Settings,
  Activity
} from 'lucide-react';
import { useState } from 'react';

const AdminDatabase = () => {
  const [databaseStats, setDatabaseStats] = useState({
    totalCases: 1247,
    totalUsers: 2847,
    totalLawyers: 156,
    storageUsed: 67,
    backupStatus: 'completed',
    lastBackup: '2024-03-21 02:00:00',
    nextBackup: '2024-03-22 02:00:00',
    apiCalls: 1432,
    responseTime: 245
  });

  const [backupHistory] = useState([
    { date: '2024-03-21 02:00:00', status: 'completed', size: '2.3GB', type: 'Full' },
    { date: '2024-03-20 02:00:00', status: 'completed', size: '2.1GB', type: 'Full' },
    { date: '2024-03-19 02:00:00', status: 'completed', size: '2.0GB', type: 'Full' },
    { date: '2024-03-18 02:00:00', status: 'failed', size: '0GB', type: 'Full' },
    { date: '2024-03-17 02:00:00', status: 'completed', size: '1.9GB', type: 'Full' }
  ]);

  const [legalDataTables] = useState([
    { name: 'cases', records: 1247, size: '1.2GB', lastUpdated: '2024-03-21 15:30:00' },
    { name: 'users', records: 2847, size: '0.8GB', lastUpdated: '2024-03-21 16:45:00' },
    { name: 'lawyers', records: 156, size: '0.3GB', lastUpdated: '2024-03-21 14:20:00' },
    { name: 'legal_categories', records: 45, size: '0.1GB', lastUpdated: '2024-03-21 12:00:00' },
    { name: 'kenya_law_api_cache', records: 8923, size: '0.9GB', lastUpdated: '2024-03-21 17:00:00' },
    { name: 'ai_responses', records: 5678, size: '1.5GB', lastUpdated: '2024-03-21 16:30:00' }
  ]);

  const [apiEndpoints] = useState([
    { endpoint: '/api/kenya-law/search', calls: 432, avgResponse: 180, status: 'healthy' },
    { endpoint: '/api/cases/submit', calls: 156, avgResponse: 320, status: 'healthy' },
    { endpoint: '/api/lawyers/rating', calls: 89, avgResponse: 150, status: 'healthy' },
    { endpoint: '/api/ai/analyze', calls: 234, avgResponse: 450, status: 'warning' },
    { endpoint: '/api/dpa/compliance', calls: 12, avgResponse: 200, status: 'healthy' }
  ]);

  return (
    <DashboardLayout title="Database Management - Kenya Legal AI Guide">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Database Management</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage legal data, backups, and Kenya Law API integration
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Refresh Stats</span>
              <span className="sm:hidden">Refresh</span>
            </Button>
            <Button className="w-full sm:w-auto">
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Backup Now</span>
              <span className="sm:hidden">Backup</span>
            </Button>
          </div>
        </div>

        {/* Database Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{databaseStats.totalCases.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Legal cases stored
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{databaseStats.storageUsed}%</div>
              <Progress value={databaseStats.storageUsed} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Database storage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Calls/min</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{databaseStats.apiCalls}</div>
              <p className="text-xs text-muted-foreground">
                Kenya Law API
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{databaseStats.responseTime}ms</div>
              <p className="text-xs text-muted-foreground">
                Average API response
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Backup Status & Legal Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Backup Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Backup Status
              </CardTitle>
              <CardDescription>Database backup and recovery status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Last Backup</p>
                      <p className="text-xs text-muted-foreground">{databaseStats.lastBackup}</p>
                    </div>
                  </div>
                  <Badge variant="default" className="w-fit">Completed</Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">Next Backup</p>
                      <p className="text-xs text-muted-foreground">{databaseStats.nextBackup}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit">Scheduled</Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Recent Backups</h4>
                  {backupHistory.slice(0, 3).map((backup, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 border rounded">
                      <div className="flex items-center gap-2">
                        {backup.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{backup.date.split(' ')[0]}</p>
                          <p className="text-xs text-muted-foreground">{backup.type} Backup</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{backup.size}</span>
                        <Badge 
                          variant={backup.status === 'completed' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {backup.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Data Tables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Legal Data Tables
              </CardTitle>
              <CardDescription>Database tables and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {legalDataTables.map((table, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-medium text-sm sm:text-base truncate">{table.name}</h3>
                        <Badge variant="outline" className="w-fit text-xs">
                          {table.records.toLocaleString()} records
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Size: {table.size}</span>
                        <span>Updated: {table.lastUpdated.split(' ')[1]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              API Endpoints Performance
            </CardTitle>
            <CardDescription>Kenya Law API and system endpoints status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="font-medium text-sm sm:text-base truncate">{endpoint.endpoint}</h3>
                      <Badge 
                        variant={
                          endpoint.status === 'healthy' ? 'default' :
                          endpoint.status === 'warning' ? 'secondary' : 'destructive'
                        }
                        className="w-fit text-xs"
                      >
                        {endpoint.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Calls: {endpoint.calls}/min</span>
                      <span>Avg Response: {endpoint.avgResponse}ms</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Database Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Database Actions
            </CardTitle>
            <CardDescription>Manage database operations and maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-2">
                <Download className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Export Data</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-2">
                <Upload className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Import Data</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-2">
                <Archive className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Archive Old</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-2">
                <Trash2 className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Clean Cache</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDatabase;