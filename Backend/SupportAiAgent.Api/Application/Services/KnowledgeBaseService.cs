using SupportAiAgent.Api.Application.Abstractions;
using SupportAiAgent.Api.Application.DTOs.KnowledgeBase;
using SupportAiAgent.Api.Domain.Entities;

namespace SupportAiAgent.Api.Application.Services
{
    public sealed class KnowledgeBaseService : IKnowledgeBaseService
    {
        private readonly IKnowledgeArticleRepository _articleRepository;

        public KnowledgeBaseService(IKnowledgeArticleRepository articleRepository)
        {
            _articleRepository = articleRepository;
        }

        public async Task<IReadOnlyList<KnowledgeArticleResponse>> GetAllArticlesAsync()
        {
            var articles = await _articleRepository.GetAllAsync();
            return articles.Select(ToResponse).ToList();
        }

        public async Task<IReadOnlyList<KnowledgeArticleResponse>> SearchAsync(
            string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return Array.Empty<KnowledgeArticleResponse>();
            }

            var words = searchTerm
                .ToLower()
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Distinct()
                .ToList();

            var articles = await _articleRepository.GetAllAsync();

            return articles
                .Select(article => new
                {
                    Article = article,
                    Score = words.Count(word =>
                        article.Title.Contains(
                            word, StringComparison.OrdinalIgnoreCase) ||
                        article.Category.Contains(
                            word, StringComparison.OrdinalIgnoreCase) ||
                        article.Content.Contains(
                            word, StringComparison.OrdinalIgnoreCase))
                })
                .Where(x => x.Score > 0)
                .OrderByDescending(x => x.Score)
                .Select(x => ToResponse(x.Article))
                .ToList();
        }

        private static KnowledgeArticleResponse ToResponse(
            KnowledgeArticle article)
        {
            return new KnowledgeArticleResponse
            {
                Id = article.Id,
                Title = article.Title,
                Content = article.Content,
                Category = article.Category
            };
        }
    }
}
