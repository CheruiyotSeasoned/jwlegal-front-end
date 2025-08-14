import { DashboardLayout } from '@/components/DachboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  User, 
  Gavel, 
  Building, 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  FileText,
  MessageSquare,
  CreditCard,
  Database,
  BarChart3,
  Users,
  Star,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Globe
} from 'lucide-react';
import { useState } from 'react';

const AdminRoles = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'General Public',
      key: 'general_public',
      icon: User,
      color: 'text-blue-600',
      userCount: 1847,
      description: 'Basic access for general public users',
      permissions: {
        case_submission: true,
        basic_search: true,
        view_own_cases: true,
        contact_lawyer: false,
        access_premium: false,
        admin_access: false,
        lawyer_rating: false,
        case_management: false,
        analytics_access: false,
        user_management: false,
        system_settings: false,
        dpa_compliance: false
      }
    },
    {
      id: 2,
      name: 'Lawyer',
      key: 'lawyer',
      icon: Gavel,
      color: 'text-green-600',
      userCount: 156,
      description: 'Full access for registered lawyers',
      permissions: {
        case_submission: true,
        basic_search: true,
        view_own_cases: true,
        contact_lawyer: true,
        access_premium: true,
        admin_access: false,
        lawyer_rating: true,
        case_management: true,
        analytics_access: false,
        user_management: false,
        system_settings: false,
        dpa_compliance: false
      }
    },
    {
      id: 3,
      name: 'Law Firm',
      key: 'law_firm',
      icon: Building,
      color: 'text-purple-600',
      userCount: 23,
      description: 'Enhanced access for law firms',
      permissions: {
        case_submission: true,
        basic_search: true,
        view_own_cases: true,
        contact_lawyer: true,
        access_premium: true,
        admin_access: false,
        lawyer_rating: true,
        case_management: true,
        analytics_access: true,
        user_management: false,
        system_settings: false,
        dpa_compliance: false
      }
    },
    {
      id: 4,
      name: 'Judicial Officer',
      key: 'judicial_officer',
      icon: Shield,
      color: 'text-orange-600',
      userCount: 12,
      description: 'Special access for judicial officers',
      permissions: {
        case_submission: true,
        basic_search: true,
        view_own_cases: true,
        contact_lawyer: true,
        access_premium: true,
        admin_access: false,
        lawyer_rating: true,
        case_management: true,
        analytics_access: true,
        user_management: false,
        system_settings: false,
        dpa_compliance: true
      }
    },
    {
      id: 5,
      name: 'Admin',
      key: 'admin',
      icon: Settings,
      color: 'text-red-600',
      userCount: 8,
      description: 'System administration access',
      permissions: {
        case_submission: true,
        basic_search: true,
        view_own_cases: true,
        contact_lawyer: true,
        access_premium: true,
        admin_access: true,
        lawyer_rating: true,
        case_management: true,
        analytics_access: true,
        user_management: true,
        system_settings: true,
        dpa_compliance: true
      }
    }
  ]);

  const permissionLabels = {
    case_submission: 'Submit Cases',
    basic_search: 'Basic Legal Search',
    view_own_cases: 'View Own Cases',
    contact_lawyer: 'Contact Lawyers',
    access_premium: 'Premium Features',
    admin_access: 'Admin Access',
    lawyer_rating: 'Rate Lawyers',
    case_management: 'Case Management',
    analytics_access: 'Analytics Access',
    user_management: 'User Management',
    system_settings: 'System Settings',
    dpa_compliance: 'DPA Compliance'
  };

  const permissionIcons = {
    case_submission: FileText,
    basic_search: Database,
    view_own_cases: Eye,
    contact_lawyer: MessageSquare,
    access_premium: CreditCard,
    admin_access: Shield,
    lawyer_rating: Star,
    case_management: FileText,
    analytics_access: BarChart3,
    user_management: Users,
    system_settings: Settings,
    dpa_compliance: Lock
  };

  const togglePermission = (roleId: number, permission: string) => {
    setRoles(roles.map(role => 
      role.id === roleId 
        ? { ...role, permissions: { ...role.permissions, [permission]: !role.permissions[permission as keyof typeof role.permissions] } }
        : role
    ));
  };

  return (
    <DashboardLayout title="Role Permissions - Kenya Legal AI Guide">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Role Permissions</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage user roles and permissions for the Kenya Legal AI Guide platform
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Create New Role</span>
            <span className="sm:hidden">New Role</span>
          </Button>
        </div>

        {/* Role Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {roles.map((role) => {
            const RoleIcon = role.icon;
            return (
              <Card key={role.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{role.name}</CardTitle>
                  <RoleIcon className={`h-4 w-4 ${role.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{role.userCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Active users
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Roles and Permissions */}
        <div className="space-y-4 sm:space-y-6">
          {roles.map((role) => {
            const RoleIcon = role.icon;
            return (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${role.color.replace('text-', 'bg-')} bg-opacity-10`}>
                        <RoleIcon className={`h-5 w-5 ${role.color}`} />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="truncate">{role.name}</span>
                          <Badge variant="outline" className="text-xs w-fit">
                            {role.userCount} users
                          </Badge>
                        </CardTitle>
                        <CardDescription className="truncate">{role.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {role.key !== 'admin' && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(role.permissions).map(([permission, enabled]) => {
                      const PermissionIcon = permissionIcons[permission as keyof typeof permissionIcons];
                      return (
                        <div key={permission} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <PermissionIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {permissionLabels[permission as keyof typeof permissionLabels]}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {enabled ? 'Enabled' : 'Disabled'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {enabled ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <Switch
                              checked={enabled}
                              onCheckedChange={() => togglePermission(role.id, permission)}
                              size="sm"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Permission Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Permission Categories</CardTitle>
            <CardDescription>
              Overview of permission categories and their purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Access
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Submit Cases</p>
                  <p>• Basic Legal Search</p>
                  <p>• View Own Cases</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Gavel className="h-4 w-4" />
                  Legal Operations
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Contact Lawyers</p>
                  <p>• Rate Lawyers</p>
                  <p>• Case Management</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Administrative
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• User Management</p>
                  <p>• System Settings</p>
                  <p>• DPA Compliance</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Kenya Legal Compliance
            </CardTitle>
            <CardDescription>
              Important compliance considerations for role permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Data Protection Act (DPA)</h4>
                  <p className="text-sm text-blue-700">
                    Only judicial officers and admins have access to DPA compliance features. 
                    This ensures proper data handling according to Kenya's legal requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <Gavel className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Law Society of Kenya (LSK)</h4>
                  <p className="text-sm text-green-700">
                    Lawyer ratings and case management features are restricted to qualified legal professionals 
                    to maintain professional standards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <Globe className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">Kenya IP Restrictions</h4>
                  <p className="text-sm text-orange-700">
                    All roles are subject to Kenya IP verification to ensure compliance with 
                    local legal jurisdiction requirements.
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

export default AdminRoles;