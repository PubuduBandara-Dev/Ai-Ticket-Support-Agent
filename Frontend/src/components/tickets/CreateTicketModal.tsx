import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ticketApi } from '../../api/ticketApi';
import { getErrorMessage } from '../../api/axiosClient';
import { Ticket } from '../../types/ticket';
import { PlusCircle } from 'lucide-react';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: (newTicket: Ticket) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onTicketCreated,
}) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError('Please provide both a subject and a description.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await ticketApi.createTicket({
        subject: subject.trim(),
        description: description.trim(),
      });
      setSubject('');
      setDescription('');
      onTicketCreated(created);
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
      title="Create Support Ticket"
      subtitle="Submit a new customer support ticket to the system"
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
            form="create-ticket-form"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Create Ticket
          </Button>
        </>
      }
    >
      <form id="create-ticket-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="ticket-subject" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Subject *
          </label>
          <input
            id="ticket-subject"
            type="text"
            required
            maxLength={200}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Cannot reset account password"
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400"
            disabled={isSubmitting}
          />
          <div className="flex justify-end mt-1">
            <span className="text-[11px] text-slate-400">{subject.length}/200</span>
          </div>
        </div>

        <div>
          <label htmlFor="ticket-description" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Description *
          </label>
          <textarea
            id="ticket-description"
            required
            rows={4}
            maxLength={5000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide detailed description of the customer issue..."
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400"
            disabled={isSubmitting}
          />
          <div className="flex justify-end mt-1">
            <span className="text-[11px] text-slate-400">{description.length}/5000</span>
          </div>
        </div>
      </form>
    </Modal>
  );
};
