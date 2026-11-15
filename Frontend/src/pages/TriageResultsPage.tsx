import React, { useState, useMemo } from 'react';
import { useTriage } from '../context/TriageContext';
import { TriageResultCard } from '../components/triage/TriageResultCard';
import { TriageReviewModal } from '../components/triage/TriageReviewModal';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  isApproved,
  isPendingApproval,
  isRejected,
  normalizePriority,
  normalizeStatus,
} from '../utils/triageUtils';

export const TriageResultsPage: React.FC = () => {
  const { triageResults } = useTriage();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Rejection modal state
  const [rejectModalState, setRejectModalState] = useState<{
    isOpen: boolean;
    triageId: number;
    ticketId: number;
  }>({
    isOpen: false,
    triageId: 0,
    ticketId: 0,
  });

  // Calculate status counts
  const pendingCount = triageResults.filter((r) => isPendingApproval(r.status)).length;
  const approvedCount = triageResults.filter((r) => isApproved(r.status)).length;
  const rejectedCount = triageResults.filter((r) => isRejected(r.status)).length;

  const filteredResults = useMemo(() => {
    return triageResults.filter((result) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        result.ticketId.toString().includes(q) ||
        result.id.toString().includes(q) ||
        result.category?.toLowerCase().includes(q) ||
        result.recommendedAction?.toLowerCase().includes(q) ||
        result.suggestedResponse?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'ALL' ||
        normalizeStatus(result.status) === normalizeStatus(statusFilter);

      const matchesPriority =
        priorityFilter === 'ALL' ||
        normalizePriority(result.priority) === normalizePriority(priorityFilter);

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [triageResults, searchQuery, statusFilter, priorityFilter]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            AI Triage Results
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Review Gemini AI-generated ticket categorization, priority scoring, customer responses, and recommended actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/tickets">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              Triage a Ticket
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Status Pill Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setStatusFilter(statusFilter === 'Pending Approval' ? 'ALL' : 'Pending Approval')}
          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'Pending Approval'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-semibold text-slate-700">Pending Review</span>
          </div>
          <span className="text-sm font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Approved' ? 'ALL' : 'Approved')}
          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'Approved'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700">Approved</span>
          </div>
          <span className="text-sm font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
            {approvedCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Rejected' ? 'ALL' : 'Rejected')}
          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'Rejected'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <XCircle className="h-4 w-4 text-rose-600" />
            <span className="text-xs font-semibold text-slate-700">Rejected</span>
          </div>
          <span className="text-sm font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-full">
            {rejectedCount}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID, category, or response..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-slate-400 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="h-3.5 w-3.5" />
              <span>Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
              <span>Priority:</span>
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Results List */}
      {triageResults.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={<Sparkles className="h-8 w-8 text-blue-500" />}
            title="No AI Triage Results Available"
            description="You have not run AI triage on any support tickets yet. Go to Support Tickets to run your first triage analysis."
            action={
              <Link to="/tickets">
                <Button
                  variant="primary"
                  leftIcon={<ArrowRight className="h-4 w-4" />}
                >
                  View Tickets to Triage
                </Button>
              </Link>
            }
          />
        </Card>
      ) : filteredResults.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            title="No Matching Results"
            description="No triage results match your current search query and filters."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setPriorityFilter('ALL');
                }}
              >
                Reset Filters
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-500 px-1">
            Displaying {filteredResults.length} of {triageResults.length} triage records
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredResults.map((result) => (
              <TriageResultCard
                key={result.id}
                result={result}
                onOpenRejectModal={(triageId, ticketId) => {
                  setRejectModalState({
                    isOpen: true,
                    triageId,
                    ticketId,
                  });
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      <TriageReviewModal
        isOpen={rejectModalState.isOpen}
        onClose={() =>
          setRejectModalState((prev) => ({ ...prev, isOpen: false }))
        }
        triageId={rejectModalState.triageId}
        ticketId={rejectModalState.ticketId}
      />
    </div>
  );
};
