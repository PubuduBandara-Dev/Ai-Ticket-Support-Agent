namespace SupportAiAgent.Api.Application.DTOs.Triage
{
    public class TriageResponse
    {
        public int Id { get; init; }

        public int TicketId { get; init; }

        public string Category { get; init; } = string.Empty;

        public string Priority { get; init; } = string.Empty;

        public string SuggestedResponse { get; init; } = string.Empty;

        public string RecommendedAction { get; init; } = string.Empty;

        public string Status { get; init; } = string.Empty;

        public DateTime CreatedAt { get; init; }
    }
}
