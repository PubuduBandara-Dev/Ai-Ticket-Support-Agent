using Microsoft.EntityFrameworkCore;
using SupportAiAgent.Api.Application.Abstractions;
using SupportAiAgent.Api.Data;
using SupportAiAgent.Api.Domain.Entities;

namespace SupportAiAgent.Api.Infrastructure.Persistence.Repositories
{
    public sealed class AgentResultRepository : IAgentResultRepository
    {
        private readonly SupportDbContext _db;

        public AgentResultRepository(SupportDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(AgentResult result)
        {
            _db.AgentResults.Add(result);
            await _db.SaveChangesAsync();
        }

        public Task<AgentResult?> GetByIdAsync(int id)
        {
            return _db.AgentResults
                .FirstOrDefaultAsync(result => result.Id == id);
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}
