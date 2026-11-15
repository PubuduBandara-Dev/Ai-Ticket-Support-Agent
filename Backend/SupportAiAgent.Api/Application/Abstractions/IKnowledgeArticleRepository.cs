using SupportAiAgent.Api.Domain.Entities;

namespace SupportAiAgent.Api.Application.Abstractions
{
    public interface IKnowledgeArticleRepository
    {
        Task<IReadOnlyList<KnowledgeArticle>> GetAllAsync();
    }
}
