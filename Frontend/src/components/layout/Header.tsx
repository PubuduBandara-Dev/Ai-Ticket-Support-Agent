import React from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const location = useLocation();

  const getPageTitle = (pathname: string): { title: string; subtitle: string } => {
    if (pathname === '/') {
      return {
        title: 'Operations Dashboard',
        subtitle: 'Real-time overview of customer support tickets and AI triage status',
      };
    }
    if (pathname.startsWith('/tickets/')) {
      return {
        title: 'Ticket Details',
        subtitle: 'Detailed ticket context, customer query, and AI triage actions',
      };
    }
    if (pathname === '/tickets') {
      return {
        title: 'Support Tickets',
        subtitle: 'Manage, search, and initiate AI triage across customer requests',
      };
    }
    if (pathname === '/triage-results') {
      return {
        title: 'AI Triage Results',
        subtitle: 'AI-generated ticket categorization, priority assessment, and suggested responses',
      };
    }
    return {
      title: 'SupportAI',
      subtitle: 'Customer Support Management',
    };
  };

  const { title, subtitle } = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h1>
          <p className="hidden text-xs text-slate-500 sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-medium text-blue-700">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>Gemini Agent Active</span>
        </div>
      </div>
    </header>
  );
};
