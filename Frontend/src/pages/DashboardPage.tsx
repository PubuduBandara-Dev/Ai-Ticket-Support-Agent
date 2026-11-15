import React, { useEffect, useState, useMemo } from 'react';
import { ticketApi } from '../api/ticketApi';
import { getErrorMessage } from '../api/axiosClient';
import { Ticket } from '../types/ticket';
import { useTriage } from '../context/TriageContext';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { RecentTicketsTable } from '../components/dashboard/RecentTicketsTable';
import { PriorityOverview } from '../components/dashboard/PriorityOverview';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import {
  Inbox,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreateTicketModal } from '../components/tickets/CreateTicketModal';
import { isPendingApproval } from '../utils/triageUtils';

export const DashboardPage: React.FC = () => {
  const { triageResults } = useTriage();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ticketApi.getTickets();
      setTickets(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Map ticketId -> latest triage result
  const triageMap = useMemo(() => {
    const map = new Map<number, typeof triageResults[0]>();
    triageResults.forEach((tr) => {
      if (!map.has(tr.ticketId)) {
        map.set(tr.ticketId, tr);
      }
    });
    return map;
  }, [triageResults]);

  // Derived metrics from real data
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(
    (t) => t.status.toLowerCase() === 'open'
  ).length;
  const triagedCount = triageMap.size;
  const pendingApprovalCount = triageResults.filter(
    (tr) => isPendingApproval(tr.status)
  ).length;

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Triage Operations
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time status of support volume, AI agent analyses, and supervisor approvals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTickets}
            isLoading={loading}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            New Ticket
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <ErrorMessage
          title="Could not load tickets"
          message={error}
          onRetry={fetchTickets}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Tickets"
          value={loading ? '—' : totalTickets}
          subtitle="All customer tickets logged"
          icon={<Inbox className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
          badge={{ text: 'Live DB', variant: 'info' }}
        />
        <SummaryCard
          title="Open Tickets"
          value={loading ? '—' : openTickets}
          subtitle="Awaiting response or resolution"
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-50"
          badge={{ text: 'Active', variant: 'warning' }}
        />
        <SummaryCard
          title="AI Triaged Tickets"
          value={triagedCount}
          subtitle="Analyzed by Gemini AI Agent"
          icon={<Sparkles className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
          badge={{ text: 'Gemini', variant: 'success' }}
        />
        <SummaryCard
          title="Pending Approval"
          value={pendingApprovalCount}
          subtitle="Requiring supervisor sign-off"
          icon={<ShieldAlert className="h-5 w-5 text-rose-600" />}
          iconBgColor="bg-rose-50"
          badge={{
            text: pendingApprovalCount > 0 ? 'Needs Action' : 'All Clear',
            variant: pendingApprovalCount > 0 ? 'warning' : 'neutral',
          }}
        />
      </div>

      {/* Main Grid: Recent Tickets & Priority Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets Table (2 cols on large screen) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Recent Support Tickets"
              subtitle="Latest incoming tickets from customers"
              action={
                <Link
                  to="/tickets"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  View All Tickets
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            />
            <CardContent className="p-0">
              {loading ? (
                <LoadingSpinner label="Fetching tickets from backend..." />
              ) : recentTickets.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title="No Tickets Available"
                    description="No customer support tickets have been created yet."
                    action={
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setIsCreateOpen(true)}
                        leftIcon={<PlusCircle className="h-4 w-4" />}
                      >
                        Create First Ticket
                      </Button>
                    }
                  />
                </div>
              ) : (
                <RecentTicketsTable
                  tickets={recentTickets}
                  triageMap={triageMap}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Priority Overview Distribution (1 col on large screen) */}
        <div>
          <PriorityOverview triageResults={triageResults} />
        </div>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onTicketCreated={(newTicket) => {
          setTickets((prev) => [newTicket, ...prev]);
        }}
      />
    </div>
  );
};
