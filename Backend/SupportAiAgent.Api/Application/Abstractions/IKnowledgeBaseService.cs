using SupportAiAgent.Api.Application.DTOs.KnowledgeBase;

namespace SupportAiAgent.Api.Application.Abstractions
{
    public interface IKnowledgeBaseService
    {
        Task<IReadOnlyList<KnowledgeArticleResponse>> GetAllArticlesAsync();

        Task<IReadOnlyList<KnowledgeArticleResponse>> SearchAsync(
            string searchTerm);
    }
}
