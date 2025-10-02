import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { MobileBottomNav } from '@/components/MobileBottomNav';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-card">
            <div className="px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <SidebarTrigger className="mr-2" />
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  <span className="font-semibold text-sm sm:text-base">Legal Buddy</span>
                </Link>
                <span className="text-muted-foreground hidden sm:inline">|</span>
                <h1 className="text-lg sm:text-xl font-semibold truncate">{title}</h1>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}

                  <span className="text-sm font-medium hidden sm:inline">
                    {user?.name}
                  </span>

                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {user?.role}
                  </span>
                </div>

                <Button variant="outline" size="sm" onClick={logout} className="text-xs sm:text-sm">
                  <LogOut className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Out</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 px-2 sm:px-4 py-4 sm:py-6 pb-20 md:pb-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </SidebarProvider>
  );
};