namespace SupportAiAgent.Api.Domain.Exceptions
{
    public sealed class TicketNotFoundException : Exception
    {
        public TicketNotFoundException(int ticketId)
            : base($"Ticket {ticketId} was not found.")
        {
        }
    }
}
