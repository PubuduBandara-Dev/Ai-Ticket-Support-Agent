using SupportAiAgent.Api.Domain.Entities;

namespace SupportAiAgent.Api.Application.Abstractions
{
    public interface IAgentResultRepository
    {
        Task AddAsync(AgentResult result);

        Task<AgentResult?> GetByIdAsync(int id);

        Task SaveChangesAsync();
    }
}
