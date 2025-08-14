import { DashboardLayout } from '@/components/DachboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Shield, 
  Globe, 
  DollarSign, 
  Gavel, 
  Database, 
  Save, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Users,
  FileText,
  Star,
  Clock,
  Zap,
  Bell,
  Mail
} from 'lucide-react';
import { useState } from 'react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // Compliance Settings
    dpaCompliance: {
      enabled: true,
      registrationNumber: 'DPA/2024/001',
      dataController: 'Legal Buddy AI Guide Ltd',
      lastAudit: '2024-03-15',
      nextAudit: '2024-09-15'
    },
    kenyaIpRestriction: {
      enabled: true,
      allowedCountries: ['KE'],
      vpnDetection: true,
      geoBlocking: true
    },
    lskCompliance: {
      enabled: true,
      codeAdherence: true,
      marketingGuidelines: true,
      professionalStandards: true
    },

    // Pricing Settings
    pricingTiers: {
      bronze: {
        name: 'Bronze',
        price: 0,
        requestsPerMonth: 50,
        features: ['Basic Search', 'Case Submission', 'Email Support']
      },
      gold: {
        name: 'Gold',
        price: 2500,
        requestsPerMonth: 100,
        features: ['Priority Support', 'Advanced Search', 'Lawyer Contact']
      },
      enterprise: {
        name: 'Enterprise',
        price: 5000,
        requestsPerMonth: 'Unlimited',
        features: ['Custom Solutions', 'API Access', 'Dedicated Support']
      }
    },
    urgencyPricing: {
      standard: { days: 14, multiplier: 1.0 },
      urgent: { days: 7, multiplier: 1.5 },
      express: { days: 3, multiplier: 2.0 },
      immediate: { days: 1, multiplier: 3.0 }
    },

    // AI Settings
    aiConfiguration: {
      modelVersion: 'legal-ai-v2.1',
      confidenceThreshold: 0.85,
      maxResponseTime: 300,
      humanReviewRequired: true,
      accuracyTracking: true
    },

    // System Settings
    systemConfiguration: {
      maintenanceMode: false,
      debugMode: false,
      logLevel: 'info',
      backupFrequency: 'daily',
      retentionPeriod: '2 years'
    },

    // Notification Settings
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      adminAlerts: true,
      lawyerAlerts: true
    }
  });

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <DashboardLayout title="System Settings - Kenya Legal AI Guide">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">System Settings</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Configure system-wide settings for the Kenya Legal AI Guide platform
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Save Changes</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </div>

        {/* Compliance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Kenya Legal Compliance
            </CardTitle>
            <CardDescription>
              Configure compliance settings for Kenya Data Protection Act and LSK requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* DPA Compliance */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-medium">Data Protection Act (DPA)</h4>
                  <p className="text-sm text-muted-foreground">
                    Kenya DPA compliance settings
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={settings.dpaCompliance.enabled ? 'default' : 'secondary'}>
                    {settings.dpaCompliance.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                  <Switch
                    checked={settings.dpaCompliance.enabled}
                    onCheckedChange={(checked) => updateSetting('dpaCompliance', 'enabled', checked)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Registration Number</Label>
                  <Input 
                    value={settings.dpaCompliance.registrationNumber}
                    onChange={(e) => updateSetting('dpaCompliance', 'registrationNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Data Controller</Label>
                  <Input 
                    value={settings.dpaCompliance.dataController}
                    onChange={(e) => updateSetting('dpaCompliance', 'dataController', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Kenya IP Restrictions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-medium">Kenya IP Restrictions</h4>
                  <p className="text-sm text-muted-foreground">
                    Restrict access to Kenya-based users only
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={settings.kenyaIpRestriction.enabled ? 'default' : 'secondary'}>
                    {settings.kenyaIpRestriction.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                  <Switch
                    checked={settings.kenyaIpRestriction.enabled}
                    onCheckedChange={(checked) => updateSetting('kenyaIpRestriction', 'enabled', checked)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.kenyaIpRestriction.vpnDetection}
                    onCheckedChange={(checked) => updateSetting('kenyaIpRestriction', 'vpnDetection', checked)}
                  />
                  <Label>VPN Detection</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.kenyaIpRestriction.geoBlocking}
                    onCheckedChange={(checked) => updateSetting('kenyaIpRestriction', 'geoBlocking', checked)}
                  />
                  <Label>Geo-blocking</Label>
                </div>
              </div>
            </div>

            {/* LSK Compliance */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-medium">Law Society of Kenya (LSK)</h4>
                  <p className="text-sm text-muted-foreground">
                    LSK code adherence and professional standards
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={settings.lskCompliance.enabled ? 'default' : 'secondary'}>
                    {settings.lskCompliance.enabled ? 'Compliant' : 'Non-compliant'}
                  </Badge>
                  <Switch
                    checked={settings.lskCompliance.enabled}
                    onCheckedChange={(checked) => updateSetting('lskCompliance', 'enabled', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing Configuration
            </CardTitle>
            <CardDescription>
              Configure pricing tiers and urgency multipliers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pricing Tiers */}
            <div className="space-y-4">
              <h4 className="font-medium">Pricing Tiers</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {Object.entries(settings.pricingTiers).map(([key, tier]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h5 className="font-medium">{tier.name}</h5>
                      <Badge variant="outline">
                        KSh {tier.price.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <Label className="text-sm">Requests/Month:</Label>
                        <Input 
                          value={tier.requestsPerMonth}
                          onChange={(e) => updateSetting('pricingTiers', key, { ...tier, requestsPerMonth: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgency Pricing */}
            <div className="space-y-4">
              <h4 className="font-medium">Urgency Pricing</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(settings.urgencyPricing).map(([key, urgency]) => (
                  <div key={key} className="border rounded-lg p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h5 className="font-medium capitalize">{key}</h5>
                      <Badge variant="outline">
                        {urgency.days} days
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <Label className="text-sm">Multiplier:</Label>
                        <Input 
                          type="number"
                          step="0.1"
                          value={urgency.multiplier}
                          onChange={(e) => updateSetting('urgencyPricing', key, { ...urgency, multiplier: parseFloat(e.target.value) })}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI Configuration
            </CardTitle>
            <CardDescription>
              Configure AI model settings and performance parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Model Version</Label>
                <Input 
                  value={settings.aiConfiguration.modelVersion}
                  onChange={(e) => updateSetting('aiConfiguration', 'modelVersion', e.target.value)}
                />
              </div>
              <div>
                <Label>Confidence Threshold</Label>
                <Input 
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={settings.aiConfiguration.confidenceThreshold}
                  onChange={(e) => updateSetting('aiConfiguration', 'confidenceThreshold', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Max Response Time (ms)</Label>
                <Input 
                  type="number"
                  value={settings.aiConfiguration.maxResponseTime}
                  onChange={(e) => updateSetting('aiConfiguration', 'maxResponseTime', parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.aiConfiguration.humanReviewRequired}
                  onCheckedChange={(checked) => updateSetting('aiConfiguration', 'humanReviewRequired', checked)}
                />
                <Label>Human Review Required</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.aiConfiguration.accuracyTracking}
                  onCheckedChange={(checked) => updateSetting('aiConfiguration', 'accuracyTracking', checked)}
                />
                <Label>Accuracy Tracking</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Configuration
            </CardTitle>
            <CardDescription>
              System-wide configuration settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.systemConfiguration.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting('systemConfiguration', 'maintenanceMode', checked)}
                />
                <Label>Maintenance Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.systemConfiguration.debugMode}
                  onCheckedChange={(checked) => updateSetting('systemConfiguration', 'debugMode', checked)}
                />
                <Label>Debug Mode</Label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Log Level</Label>
                <Select 
                  value={settings.systemConfiguration.logLevel}
                  onValueChange={(value) => updateSetting('systemConfiguration', 'logLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Backup Frequency</Label>
                <Select 
                  value={settings.systemConfiguration.backupFrequency}
                  onValueChange={(value) => updateSetting('systemConfiguration', 'backupFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Retention Period</Label>
                <Select 
                  value={settings.systemConfiguration.retentionPeriod}
                  onValueChange={(value) => updateSetting('systemConfiguration', 'retentionPeriod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 year">1 Year</SelectItem>
                    <SelectItem value="2 years">2 Years</SelectItem>
                    <SelectItem value="5 years">5 Years</SelectItem>
                    <SelectItem value="10 years">10 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure notification preferences for different user types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">System Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifications.emailAlerts}
                      onCheckedChange={(checked) => updateSetting('notifications', 'emailAlerts', checked)}
                    />
                    <Label>Email Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifications.smsAlerts}
                      onCheckedChange={(checked) => updateSetting('notifications', 'smsAlerts', checked)}
                    />
                    <Label>SMS Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                    />
                    <Label>Push Notifications</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">User Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifications.adminAlerts}
                      onCheckedChange={(checked) => updateSetting('notifications', 'adminAlerts', checked)}
                    />
                    <Label>Admin Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifications.lawyerAlerts}
                      onCheckedChange={(checked) => updateSetting('notifications', 'lawyerAlerts', checked)}
                    />
                    <Label>Lawyer Alerts</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;