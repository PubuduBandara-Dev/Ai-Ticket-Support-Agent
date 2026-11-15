import React, { useEffect, useState, useMemo } from 'react';
import { ticketApi } from '../api/ticketApi';
import { getErrorMessage } from '../api/axiosClient';
import { Ticket } from '../types/ticket';
import { useTriage } from '../context/TriageContext';
import { TicketFilter } from '../components/tickets/TicketFilter';
import { CreateTicketModal } from '../components/tickets/CreateTicketModal';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { formatDateTime } from '../../src/utils/dateUtils';
import { getPriorityBadgeStyle, getStatusBadgeStyle } from '../utils/formatters';
import {
  PlusCircle,
  RefreshCw,
  ArrowRight,
  Inbox,
  FilterX,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TicketsPage: React.FC = () => {
  const { triageResults } = useTriage();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
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

  // Unique statuses for filter dropdown
  const uniqueStatuses = useMemo(() => {
    const set = new Set<string>();
    tickets.forEach((t) => {
      if (t.status) set.add(t.status);
    });
    return Array.from(set);
  }, [tickets]);

  // Filtered tickets based on search query and status
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toString().includes(searchQuery);

      const matchesStatus =
        statusFilter === 'ALL' ||
        ticket.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Customer Support Tickets
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            View active support tickets, initiate AI triage analysis, and review triage outcomes.
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
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Create Ticket
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

      {/* Filters and Search */}
      <Card className="p-4">
        <TicketFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          statuses={uniqueStatuses}
        />
      </Card>

      {/* Tickets Table / List */}
      <Card>
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <span>All Tickets</span>
              <span className="text-xs font-normal text-slate-500">
                ({filteredTickets.length} of {tickets.length})
              </span>
            </div>
          }
          subtitle="Showing ticket history from SQLite database"
        />
        <CardContent className="p-0">
          {loading ? (
            <LoadingSpinner label="Loading tickets from API..." />
          ) : tickets.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Inbox className="h-6 w-6 text-slate-400" />}
                title="No Tickets in System"
                description="Your database currently has no tickets. Create a support ticket to get started."
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
          ) : filteredTickets.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<FilterX className="h-6 w-6 text-slate-400" />}
                title="No Matching Tickets"
                description={`No tickets match your search "${searchQuery}" or status filter.`}
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('ALL');
                    }}
                  >
                    Reset Filters
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">AI Priority</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTickets.map((ticket) => {
                    const triage = triageMap.get(ticket.id);
                    const statusStyle = getStatusBadgeStyle(ticket.status);
                    const priorityStyle = triage
                      ? getPriorityBadgeStyle(triage.priority)
                      : null;

                    return (
                      <tr
                        key={ticket.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          #{ticket.id}
                        </td>
                        <td className="py-3.5 px-4 max-w-md">
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className="font-medium text-slate-900 hover:text-blue-600 transition-colors block truncate"
                          >
                            {ticket.subject}
                          </Link>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {ticket.description}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <Badge
                            bgClass={statusStyle.bg}
                            textClass={statusStyle.text}
                            borderClass={statusStyle.border}
                            dotClass={statusStyle.dot}
                            size="sm"
                          >
                            {ticket.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {priorityStyle && triage ? (
                            <Badge
                              bgClass={priorityStyle.bg}
                              textClass={priorityStyle.text}
                              borderClass={priorityStyle.border}
                              dotClass={priorityStyle.dot}
                              size="sm"
                            >
                              {triage.priority}
                            </Badge>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              Not Triaged
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                          {formatDateTime(ticket.createdAt)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                          >
                            <span>View Details</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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
