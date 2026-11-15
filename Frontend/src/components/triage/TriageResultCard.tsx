import React, { useState } from 'react';
import { AgentResult } from '../../types/triage';
import { Card, CardHeader, CardContent, CardFooter } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatDateTime } from '../../utils/dateUtils';
import { getPriorityBadgeStyle, getStatusBadgeStyle } from '../../utils/formatters';
import { isPendingApproval } from '../../utils/triageUtils';
import {
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTriage } from '../../context/TriageContext';
import { getErrorMessage } from '../../api/axiosClient';

interface TriageResultCardProps {
  result: AgentResult;
  onOpenRejectModal?: (triageId: number, ticketId: number) => void;
  showTicketLink?: boolean;
}

export const TriageResultCard: React.FC<TriageResultCardProps> = ({
  result,
  onOpenRejectModal,
  showTicketLink = true,
}) => {
  const { approveTriage, isReviewingId } = useTriage();
  const [copied, setCopied] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const priorityStyle = getPriorityBadgeStyle(result.priority);
  const statusStyle = getStatusBadgeStyle(result.status);

  const isPending = isPendingApproval(result.status);
  const isApproving = isReviewingId === result.id;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.suggestedResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleApprove = async () => {
    setActionError(null);
    try {
      await approveTriage(result.id);
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  return (
    <Card className="border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <CardHeader
        title={
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900">
              Triage #{result.id}
            </span>
            {showTicketLink && (
              <Link
                to={`/tickets/${result.ticketId}`}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5"
              >
                (Ticket #{result.ticketId})
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        }
        subtitle={
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Generated {formatDateTime(result.createdAt)}</span>
          </div>
        }
        action={
          <div className="flex items-center gap-2">
            <Badge
              bgClass={priorityStyle.bg}
              textClass={priorityStyle.text}
              borderClass={priorityStyle.border}
              dotClass={priorityStyle.dot}
            >
              {result.priority} Priority
            </Badge>
            <Badge
              bgClass={statusStyle.bg}
              textClass={statusStyle.text}
              borderClass={statusStyle.border}
              dotClass={statusStyle.dot}
            >
              {result.status}
            </Badge>
          </div>
        }
      />

      {/* Content */}
      <CardContent className="space-y-4">
        {actionError && (
          <div className="p-2.5 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
            {actionError}
          </div>
        )}

        {/* Category & AI metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <Layers className="h-4 w-4 text-blue-600" />
          <span className="text-slate-500">Identified Category:</span>
          <span className="font-semibold text-slate-900">{result.category || 'General Support'}</span>
        </div>

        {/* Recommended Action */}
        <div className="rounded-lg bg-blue-50/60 border border-blue-100 p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-800 mb-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Recommended Next Action</span>
          </div>
          <p className="text-sm text-blue-950 font-medium leading-relaxed">
            {result.recommendedAction}
          </p>
        </div>

        {/* Suggested Customer Response */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Suggested Customer Response
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 py-1 rounded hover:bg-slate-200/60"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy Response</span>
                </>
              )}
            </button>
          </div>
          <div className="p-3 bg-white rounded border border-slate-200 text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-wrap selection:bg-blue-100">
            {result.suggestedResponse}
          </div>
        </div>
      </CardContent>

      {/* Human Approval Workflow Footer */}
      {isPending && (
        <CardFooter className="flex flex-wrap items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-1.5 text-xs text-amber-700">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <span>Requires human supervisor review before delivery</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenRejectModal && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenRejectModal(result.id, result.ticketId)}
                leftIcon={<XCircle className="h-3.5 w-3.5 text-rose-500" />}
                className="text-rose-700 hover:bg-rose-50 hover:border-rose-300"
              >
                Reject
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={handleApprove}
              isLoading={isApproving}
              leftIcon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
              className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-600 text-white"
            >
              Approve Response
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
