using Microsoft.EntityFrameworkCore;
using SupportAiAgent.Api.Application.Abstractions;
using SupportAiAgent.Api.Data;
using SupportAiAgent.Api.Domain.Entities;

namespace SupportAiAgent.Api.Infrastructure.Persistence.Repositories
{
    public sealed class KnowledgeArticleRepository : IKnowledgeArticleRepository
    {
        private readonly SupportDbContext _db;

        public KnowledgeArticleRepository(SupportDbContext db)
        {
            _db = db;
        }

        public async Task<IReadOnlyList<KnowledgeArticle>> GetAllAsync()
        {
            return await _db.KnowledgeArticles
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
