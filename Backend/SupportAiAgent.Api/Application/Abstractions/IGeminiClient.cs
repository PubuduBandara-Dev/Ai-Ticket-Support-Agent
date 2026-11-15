using SupportAiAgent.Api.Domain.Entities;

namespace SupportAiAgent.Api.Application.Abstractions
{
    public interface IGeminiClient
    {
        Task<string> GenerateTriageAsync(Ticket ticket);
    }
}
