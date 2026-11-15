export interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
}
