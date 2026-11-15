namespace SupportAiAgent.Api.Application.DTOs.KnowledgeBase
{
    public class KnowledgeArticleResponse
    {
        public int Id { get; init; }

        public string Title { get; init; } = string.Empty;

        public string Content { get; init; } = string.Empty;

        public string Category { get; init; } = string.Empty;
    }
}
