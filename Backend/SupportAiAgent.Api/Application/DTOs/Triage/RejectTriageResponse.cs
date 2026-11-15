namespace SupportAiAgent.Api.Application.DTOs.Triage
{
    public class RejectTriageResponse
    {
        public int Id { get; init; }

        public string Status { get; init; } = string.Empty;

        public string Reason { get; init; } = string.Empty;
    }
}
