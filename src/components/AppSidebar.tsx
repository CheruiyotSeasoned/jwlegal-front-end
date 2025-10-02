import {
  Users,
  FileText,
  Settings,
  Shield,
  Database,
  BarChart3,
  Home,
  Search,
  BookOpen,
  Scale,
  MessageSquare,
  Calendar,
  Plus,
  Clock,
  DollarSign,
  Briefcase,
  Award,
  Zap,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';

// Type definition for navigation items
interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  description?: string;
  badge?: string;
  gradient?: string;
}

interface NavItemDivider {
  divider: true;
}

type NavItemWithDivider = NavigationItem | NavItemDivider;

export function AppSidebar() {
  const sidebar = useSidebar();
  const location = useLocation();
  const { user, hasRole } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  // Admin navigation items with section dividers
  const adminNavItems: NavItemWithDivider[] = [
    {
      title: 'Dashboard',
      url: '/admin-dashboard',
      icon: Home,
      description: 'System overview',
      badge: 'Live',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'User Management',
      url: '/admin/users',
      icon: Users,
      description: 'Manage users & roles',
      badge: 'Active',
      gradient: 'from-green-500 to-emerald-600'
    },
    { divider: true },
    {
      title: 'Security',
      url: '/admin/roles',
      icon: Shield,
      description: 'Role permissions',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      title: 'System Settings',
      url: '/admin/settings',
      icon: Settings,
      description: 'Configuration',
      gradient: 'from-gray-500 to-slate-600'
    },
    { divider: true },
    {
      title: 'Analytics',
      url: '/admin/analytics',
      icon: BarChart3,
      description: 'Performance metrics',
      badge: 'New',
      gradient: 'from-indigo-500 to-blue-600'
    },
    {
      title: 'Database',
      url: '/admin/database',
      icon: Database,
      description: 'Data management',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      title: 'Research Submissions',
      url: '/admin/research-submissions',
      icon: FileText,
      description: 'Review requests',
      badge: 'Pending',
      gradient: 'from-purple-500 to-violet-600'
    },
  ];

  // Lawyer navigation items
  const lawyerNavItems: NavItemWithDivider[] = [
    {
      title: 'Dashboard',
      url: '/user-dashboard',
      icon: Home,
      description: 'Your overview',
      gradient: 'from-blue-500 to-cyan-600'
    },
    { divider: true },
    {
      title: 'My Cases',
      url: '/lawyer/cases',
      icon: FileText,
      description: 'Case management',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      title: 'Client Management',
      url: '/lawyer/clients',
      icon: Users,
      description: 'Client relationships',
      gradient: 'from-blue-500 to-indigo-600'
    },
    { divider: true },
    {
      title: 'Legal Research',
      url: '/lawyer/research',
      icon: Search,
      description: 'Research tools',
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Messages',
      url: '/lawyer/messages',
      icon: MessageSquare,
      description: 'Communication',
      gradient: 'from-pink-500 to-rose-600'
    },
    { divider: true },
    {
      title: 'Calendar',
      url: '/lawyer/calendar',
      icon: Calendar,
      description: 'Schedule & deadlines',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      title: 'Billing',
      url: '/lawyer/billing',
      icon: DollarSign,
      description: 'Financial management',
      gradient: 'from-yellow-500 to-amber-600'
    },
  ];

  // Client navigation items
  const clientNavItems: NavItemWithDivider[] = [
    {
      title: 'Dashboard',
      url: '/user-dashboard',
      icon: Home,
      description: 'Your overview',
      gradient: 'from-blue-500 to-cyan-600'
    },
    { divider: true },
    {
      title: 'My Cases',
      url: '/client/cases',
      icon: FileText,
      description: 'Case tracking',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      title: 'Submit Case',
      url: '/client/submit',
      icon: Plus,
      description: 'New case request',
      gradient: 'from-blue-500 to-cyan-600'
    },
    { divider: true },
    {
      title: 'Messages',
      url: '/client/messages',
      icon: MessageSquare,
      description: 'Legal team chat',
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Appointments',
      url: '/client/appointments',
      icon: Calendar,
      description: 'Meetings & consultations',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      title: 'Documents',
      url: '/client/documents',
      icon: BookOpen,
      description: 'Case documents',
      gradient: 'from-indigo-500 to-blue-600'
    },
  ];

  // Judicial navigation items
  const judicialNavItems: NavItemWithDivider[] = [
    {
      title: 'Dashboard',
      url: '/user-dashboard',
      icon: Home,
      description: 'Your overview',
      gradient: 'from-blue-500 to-cyan-600'
    },
    { divider: true },
    {
      title: 'Legal Research',
      url: '/judicial/research',
      icon: BookOpen,
      description: 'Research tools',
      badge: 'AI Enhanced',
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Precedent Search',
      url: '/judicial/precedents',
      icon: Search,
      description: 'Case precedents',
      gradient: 'from-blue-500 to-indigo-600'
    },
    { divider: true },
    {
      title: 'Case Analysis',
      url: '/judicial/analysis',
      icon: Scale,
      description: 'Legal analysis',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      title: 'Hearings',
      url: '/judicial/hearings',
      icon: Calendar,
      description: 'Court schedule',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      title: 'Pending Reviews',
      url: '/judicial/reviews',
      icon: Clock,
      description: 'Case reviews',
      gradient: 'from-yellow-500 to-amber-600'
    },
  ];

  const items = hasRole(['admin']) ? adminNavItems :
    user?.role === 'lawyer' ? lawyerNavItems :
      user?.role === 'client' ? clientNavItems :
        user?.role === 'judicial' ? judicialNavItems : [];

  const groupLabel = hasRole(['admin']) ? 'Administration' : `${user?.role?.charAt(0).toUpperCase()}${user?.role?.slice(1)} Tools`;

  // Role-based theme colors
  const getRoleTheme = () => {
    switch (user?.role) {
      case 'lawyer':
        return 'from-emerald-500/20 to-blue-500/20';
      case 'client':
        return 'from-blue-500/20 to-purple-500/20';
      case 'judicial':
        return 'from-purple-500/20 to-indigo-500/20';
      case 'admin':
        return 'from-red-500/20 to-orange-500/20';
      default:
        return 'from-gray-500/20 to-slate-500/20';
    }
  };

  const renderNavItem = (item: NavigationItem) => (
    <SidebarMenuItem key={item.title} className="mb-2 last:mb-0">
      <SidebarMenuButton
        asChild
        tooltip={sidebar.state === 'collapsed' ? item.title : undefined}
        className="group relative overflow-hidden transition-transform duration-200 hover:translate-y-[1px] hover:shadow-sm"
      >
        <NavLink
          to={item.url}
          end
          className={({ isActive }) => cn(
            "flex items-center gap-3 rounded-lg px-4 py-2.5 min-h-[50px] text-sm font-medium transition-all duration-200",
            "hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            isActive && [
              "bg-gradient-to-r from-primary/10 to-primary/5",
              "text-primary border-l-2 border-primary",
              "shadow-sm"
            ],
            !isActive && "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br transition-all duration-200 flex-shrink-0",
            item.gradient || 'from-gray-500 to-slate-600',
            "group-hover:scale-110 group-hover:shadow-md"
          )}>
            <item.icon className="h-4 w-4 text-white" />
          </div>

          {sidebar.state !== 'collapsed' && (
            <div className="flex flex-1 items-center justify-between min-w-0">
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-medium truncate">{item.title}</span>
                {item.description && (
                  <span className="text-xs text-muted-foreground/70 truncate">{item.description}</span>
                )}
              </div>

              {item.badge && (
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary/20 to-primary/10 px-2 py-0.5 text-xs font-medium text-primary whitespace-nowrap">
                    {item.badge}
                  </span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                </div>
              )}
            </div>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar
      className={cn(
        sidebar.state === 'collapsed' ? 'w-14' : 'w-64',
        'border-r border-border/50 backdrop-blur-sm'
      )}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center gap-3 px-2">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br",
            getRoleTheme()
          )}>
            <Award className="h-4 w-4 text-primary" />
          </div>
          {sidebar.state !== 'collapsed' && (
            <div className="flex flex-col">
              <h2 className="text-sm font-semibold text-foreground">LegalAI Platform</h2>
              <p className="text-xs text-muted-foreground">{groupLabel}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
            {sidebar.state !== 'collapsed' ? 'Navigation' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) =>
                'divider' in item ? (
                  <SidebarSeparator key={`divider-${index}`} className="my-2" />
                ) : (
                  renderNavItem(item)
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {sidebar.state !== 'collapsed' && (
        <SidebarFooter className="border-t border-border/50 pt-4">
          <Link to="/app" className="px-2">
            <div className="rounded-lg bg-gradient-to-r from-accent/20 to-accent/10 p-3">
              <div className="flex items-center gap-2">
                <div className="relative flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-yellow-500 to-orange-500">
                  <Sparkles className="h-3 w-3 text-white" />
                  {user && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse ring-2 ring-white" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground">
                    AI Assistant
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Always here to help
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}