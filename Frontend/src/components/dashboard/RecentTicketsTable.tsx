import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Ticket } from '../../types/ticket';
import { AgentResult } from '../../types/triage';
import { Badge } from '../common/Badge';
import { formatDateTime } from '../../utils/dateUtils';
import { getPriorityBadgeStyle, getStatusBadgeStyle } from '../../utils/formatters';

interface RecentTicketsTableProps {
  tickets: Ticket[];
  triageMap: Map<number, AgentResult>;
}

export const RecentTicketsTable: React.FC<RecentTicketsTableProps> = ({ tickets, triageMap }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
          <tr>
            <th className="py-3 px-4">Ticket</th>
            <th className="py-3 px-4">Subject</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">AI Priority</th>
            <th className="py-3 px-4">Created Date</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tickets.map((ticket) => {
            const triage = triageMap.get(ticket.id);
            const statusStyle = getStatusBadgeStyle(ticket.status);
            const priorityStyle = triage ? getPriorityBadgeStyle(triage.priority) : null;

            return (
              <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                  #{ticket.id}
                </td>
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="font-medium text-slate-900 truncate">{ticket.subject}</div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">{ticket.description}</div>
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
                    <span className="text-xs text-slate-400 italic">Not triaged</span>
                  )}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                  {formatDateTime(ticket.createdAt)}
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <Link
                    to={`/tickets/${ticket.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span>View</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
