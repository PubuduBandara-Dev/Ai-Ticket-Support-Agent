namespace SupportAiAgent.Api.Domain.Entities
{
    using SupportAiAgent.Api.Domain.Enums;

    public class Ticket
    {
        public int Id { get; set; }

        public string Subject { get; set; } = "";

        public string Description { get; set; } = "";

        public TicketStatus Status { get; set; } = TicketStatus.Open;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
