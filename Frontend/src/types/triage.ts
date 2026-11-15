export type TriagePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TriageStatus = 'Pending Approval' | 'Approved' | 'Rejected';

export interface AgentResult {
  id: number;
  ticketId: number;
  category: string;
  priority: TriagePriority | string;
  suggestedResponse: string;
  recommendedAction: string;
  status: TriageStatus | string;
  createdAt: string;
}

export interface RejectTriageRequest {
  reason: string;
}

export interface RejectTriageResponse {
  id: number;
  status: string;
  reason: string;
}
