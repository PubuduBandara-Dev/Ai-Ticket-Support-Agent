import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import { triageApi } from '../api/triageApi';
import { getErrorMessage } from '../api/axiosClient';
import { Ticket } from '../types/ticket';
import { useTriage } from '../context/TriageContext';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { TriageResultCard } from '../components/triage/TriageResultCard';
import { TriageReviewModal } from '../components/triage/TriageReviewModal';
import { formatDateTime } from '../utils/dateUtils';
import { getStatusBadgeStyle } from '../utils/formatters';
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  RefreshCw,
} from 'lucide-react';

export const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ticketId = Number(id);

  const { getTriageForTicket, addTriageResult } = useTriage();
  const triageResult = getTriageForTicket(ticketId);

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loadingTicket, setLoadingTicket] = useState<boolean>(true);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const ticketRequestRef = useRef<AbortController | null>(null);

  // AI Triage state
  const [isTriaging, setIsTriaging] = useState<boolean>(false);
  const [triageError, setTriageError] = useState<string | null>(null);

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

  const fetchTicket = useCallback(async () => {
    ticketRequestRef.current?.abort();

    if (isNaN(ticketId)) {
      setTicket(null);
      setTicketError('Invalid ticket ID');
      setLoadingTicket(false);
      return;
    }

    const controller = new AbortController();
    ticketRequestRef.current = controller;
    setLoadingTicket(true);
    setTicketError(null);
    try {
      const data = await ticketApi.getTicketById(ticketId, controller.signal);
      if (!controller.signal.aborted && ticketRequestRef.current === controller) {
        setTicket(data);
      }
    } catch (err) {
      if (!controller.signal.aborted && ticketRequestRef.current === controller) {
        setTicketError(getErrorMessage(err));
      }
    } finally {
      if (ticketRequestRef.current === controller) {
        ticketRequestRef.current = null;
        setLoadingTicket(false);
      }
    }
  }, [ticketId]);

  useEffect(() => {
    void fetchTicket();
    return () => {
      ticketRequestRef.current?.abort();
      ticketRequestRef.current = null;
    };
  }, [fetchTicket]);

  const handleRunTriage = async () => {
    if (!ticket || isTriaging) return;

    setIsTriaging(true);
    setTriageError(null);

    try {
      const result = await triageApi.runTriage(ticket.id);
      addTriageResult(result);
    } catch (err) {
      setTriageError(getErrorMessage(err));
    } finally {
      setIsTriaging(false);
    }
  };

  if (loadingTicket) {
    return (
      <div className="py-12">
        <LoadingSpinner label="Loading ticket details from backend..." size="lg" />
      </div>
    );
  }

  if (ticketError || !ticket) {
    return (
      <div className="space-y-4">
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tickets</span>
        </Link>
        <ErrorMessage
          title="Ticket Not Found"
          message={ticketError || `Ticket #${id} could not be loaded.`}
          onRetry={fetchTicket}
        />
      </div>
    );
  }

  const statusStyle = getStatusBadgeStyle(ticket.status);

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/tickets"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
            aria-label="Back to all tickets"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Ticket #{ticket.id}
              </span>
              <Badge
                bgClass={statusStyle.bg}
                textClass={statusStyle.text}
                borderClass={statusStyle.border}
                dotClass={statusStyle.dot}
                size="sm"
              >
                {ticket.status}
              </Badge>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl mt-0.5">
              {ticket.subject}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTicket}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleRunTriage}
            isLoading={isTriaging}
            disabled={isTriaging}
            leftIcon={<Sparkles className="h-4 w-4 text-blue-300" />}
            className="bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-600"
          >
            {isTriaging ? 'Running Gemini AI Triage...' : 'Run AI Triage'}
          </Button>
        </div>
      </div>

      {/* Main Ticket Layout: Ticket Overview & AI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Ticket Metadata & Description (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader
              title="Ticket Information"
              subtitle="Customer query parameters"
            />
            <CardContent className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Creation Date
                </span>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{formatDateTime(ticket.createdAt)}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Ticket Status
                </span>
                <Badge
                  bgClass={statusStyle.bg}
                  textClass={statusStyle.text}
                  borderClass={statusStyle.border}
                  dotClass={statusStyle.dot}
                >
                  {ticket.status}
                </Badge>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Ticket ID
                </span>
                <span className="text-sm font-mono text-slate-700 font-medium">
                  #{ticket.id}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Customer Description"
              subtitle="Raw message provided by user"
            />
            <CardContent>
              <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-4 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                {ticket.description}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Triage Analysis (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Triage Error Alert */}
          {triageError && (
            <ErrorMessage
              title="AI Triage Request Failed"
              message={triageError}
              onRetry={handleRunTriage}
            />
          )}

          {/* Running Triage Loading Banner */}
          {isTriaging && (
            <Card className="border-blue-200 bg-blue-50/40 p-6">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <LoadingSpinner
                  size="lg"
                  label="Calling .NET AI Agent (POST /api/triage)..."
                />
                <p className="text-xs text-slate-500 max-w-md">
                  Gemini is analyzing the ticket content, querying support tools, categorizing urgency, and generating recommended actions.
                </p>
              </div>
            </Card>
          )}

          {/* Triage Result Display */}
          {!isTriaging && triageResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h3 className="text-base font-semibold text-slate-900">
                    AI Triage Assessment
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  Status: <strong className="text-slate-800">{triageResult.status}</strong>
                </span>
              </div>

              <TriageResultCard
                result={triageResult}
                showTicketLink={false}
                onOpenRejectModal={(triageId, tId) => {
                  setRejectModalState({
                    isOpen: true,
                    triageId,
                    ticketId: tId,
                  });
                }}
              />
            </div>
          ) : !isTriaging ? (
            <Card>
              <CardContent className="py-12">
                <EmptyState
                  icon={<Sparkles className="h-8 w-8 text-blue-500" />}
                  title="No AI Triage Generated Yet"
                  description="This ticket has not yet been analyzed by the AI Support Agent. Click the button below to initiate automated categorization, priority assignment, and suggested response generation."
                  action={
                    <Button
                      variant="primary"
                      onClick={handleRunTriage}
                      leftIcon={<Sparkles className="h-4 w-4 text-blue-300" />}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Run AI Triage Now
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      {/* Reject Modal */}
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
