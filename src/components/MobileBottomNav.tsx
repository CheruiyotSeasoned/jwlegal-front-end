import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  User, 
  Plus,
  Search,
  Calendar,
  BookOpen,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LegalAIDialog } from './LegalAIDialog';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { user, hasRole } = useAuth();
  const currentPath = location.pathname;
  const [isLegalAIOpen, setIsLegalAIOpen] = useState(false);

  const isActive = (path: string) => currentPath === path;

  // Get navigation items based on user role
  const getNavItems = () => {
    if (hasRole(['admin'])) {
      return [
        { title: 'Dashboard', url: '/admin-dashboard', icon: Home, type: 'link' },
        { title: 'Users', url: '/admin/users', icon: User, type: 'link' },
        { title: 'Research', icon: Bot, type: 'dialog', action: () => setIsLegalAIOpen(true) },
        { title: 'Settings', url: '/admin/settings', icon: User, type: 'link' },
      ];
    } else if (hasRole(['lawyer'])) {
      return [
        { title: 'Dashboard', url: '/user-dashboard', icon: Home, type: 'link' },
        { title: 'Cases', url: '/lawyer/cases', icon: FileText, type: 'link' },
        { title: 'Research', icon: Bot, type: 'dialog', action: () => setIsLegalAIOpen(true) },
        { title: 'Messages', url: '/lawyer/messages', icon: MessageSquare, type: 'link' },
      ];
    } else if (hasRole(['judicial'])) {
      return [
        { title: 'Dashboard', url: '/user-dashboard', icon: Home, type: 'link' },
        { title: 'Research', icon: Bot, type: 'dialog', action: () => setIsLegalAIOpen(true) },
        { title: 'Precedents', url: '/judicial/precedents', icon: BookOpen, type: 'link' },
        { title: 'Calendar', url: '/judicial/calendar', icon: Calendar, type: 'link' },
      ];
    } else {
      // Client/General public
      return [
        { title: 'Home', url: '/user-dashboard', icon: Home, type: 'link' },
        { title: 'Cases', url: '/client/cases', icon: FileText, type: 'link' },
        { title: 'Research', icon: Bot, type: 'dialog', action: () => setIsLegalAIOpen(true) },
        { title: 'Submit', url: '/client/submit', icon: Plus, type: 'link' },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item, index) => (
            <div key={index}>
              {item.type === 'link' ? (
                <Link
                  to={item.url}
                  className={cn(
                    "flex flex-col items-center justify-center w-full py-2 px-1 rounded-lg transition-colors",
                    isActive(item.url)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{item.title}</span>
                </Link>
              ) : (
                <button
                  onClick={item.action}
                  className="flex flex-col items-center justify-center w-full py-2 px-1 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{item.title}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legal AI Dialog */}
      <LegalAIDialog 
        open={isLegalAIOpen} 
        onOpenChange={setIsLegalAIOpen} 
      />
    </>
  );
}; 