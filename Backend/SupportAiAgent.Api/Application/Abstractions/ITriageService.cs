using SupportAiAgent.Api.Application.DTOs.Triage;

namespace SupportAiAgent.Api.Application.Abstractions
{
    public interface ITriageService
    {
        Task<TriageResponse> RunTriageAsync(int ticketId);

        Task<TriageResponse> ApproveTriageAsync(int id);

        Task<RejectTriageResponse> RejectTriageAsync(
            int id,
            RejectTriageCommand command);
    }
}
