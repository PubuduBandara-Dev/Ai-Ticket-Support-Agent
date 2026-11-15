import { apiClient } from './axiosClient';
import { AgentResult, RejectTriageRequest, RejectTriageResponse } from '../types/triage';

export const triageApi = {
  /**
   * Triggers the AI agent to triage and analyze a support ticket.
   * Endpoint: POST /api/triage/{ticketId}
   */
  async runTriage(ticketId: number): Promise<AgentResult> {
    const response = await apiClient.post<AgentResult>(`/api/triage/${ticketId}`);
    return response.data;
  },

  /**
   * Approves an AI triage recommendation.
   * Endpoint: POST /api/triage/{id}/approve
   */
  async approveTriage(id: number): Promise<AgentResult> {
    const response = await apiClient.post<AgentResult>(`/api/triage/${id}/approve`);
    return response.data;
  },

  /**
   * Rejects an AI triage recommendation with a reason.
   * Endpoint: POST /api/triage/{id}/reject
   */
  async rejectTriage(id: number, request: RejectTriageRequest): Promise<RejectTriageResponse> {
    const response = await apiClient.post<RejectTriageResponse>(`/api/triage/${id}/reject`, request);
    return response.data;
  },
};
