namespace SupportAiAgent.Api.Domain.Entities
{
    using SupportAiAgent.Api.Domain.Enums;

    public class AgentResult
    {
        public int Id { get; set; }

        public int TicketId { get; set; }

        public string Category { get; set; } = "";

        public TriagePriority Priority { get; set; }

        public string SuggestedResponse { get; set; } = "";

        public string RecommendedAction { get; set; } = "";

        public TriageStatus Status { get; set; } = TriageStatus.PendingApproval;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
