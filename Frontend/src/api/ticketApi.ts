import { apiClient } from './axiosClient';
import { Ticket, CreateTicketRequest } from '../types/ticket';

export const ticketApi = {
  /**
   * Retrieves all support tickets ordered by creation date descending.
   */
  async getTickets(): Promise<Ticket[]> {
    const response = await apiClient.get<Ticket[]>('/api/tickets');
    return response.data;
  },

  /**
   * Retrieves details for a specific support ticket by its ID.
   */
  async getTicketById(id: number, signal?: AbortSignal): Promise<Ticket> {
    const response = await apiClient.get<Ticket>(`/api/tickets/${id}`, { signal });
    return response.data;
  },

  /**
   * Creates a new support ticket.
   */
  async createTicket(request: CreateTicketRequest): Promise<Ticket> {
    const response = await apiClient.post<Ticket>('/api/tickets', request);
    return response.data;
  },
};
