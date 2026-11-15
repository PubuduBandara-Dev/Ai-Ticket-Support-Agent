import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { getErrorMessage } from '../../api/axiosClient';
import { useTriage } from '../../context/TriageContext';
import { XCircle } from 'lucide-react';

interface TriageReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  triageId: number;
  ticketId: number;
}

export const TriageReviewModal: React.FC<TriageReviewModalProps> = ({
  isOpen,
  onClose,
  triageId,
  ticketId,
}) => {
  const { rejectTriage } = useTriage();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for rejecting this AI triage recommendation.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await rejectTriage(triageId, { reason: reason.trim() });
      setReason('');
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject AI Recommendation"
      subtitle={`Provide feedback for rejecting triage recommendation #${triageId} (Ticket #${ticketId})`}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="reject-triage-form"
            variant="danger"
            isLoading={isSubmitting}
            leftIcon={<XCircle className="h-4 w-4" />}
          >
            Confirm Rejection
          </Button>
        </>
      }
    >
      <form id="reject-triage-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="reject-reason" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Rejection Reason *
          </label>
          <textarea
            id="reject-reason"
            required
            rows={4}
            maxLength={1000}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why the recommendation was rejected (e.g., incorrect category, tone mismatch, missing account steps)..."
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder:text-slate-400"
            disabled={isSubmitting}
          />
          <div className="flex justify-end mt-1">
            <span className="text-[11px] text-slate-400">{reason.length}/1000</span>
          </div>
        </div>
      </form>
    </Modal>
  );
};
