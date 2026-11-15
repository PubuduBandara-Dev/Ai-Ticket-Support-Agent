using SupportAiAgent.Api.Application.Abstractions;

namespace SupportAiAgent.Api.Infrastructure.Gemini.Tools
{
    public sealed class SearchKnowledgeBaseTool
    {
        private readonly IKnowledgeBaseService _knowledgeBaseService;

        public SearchKnowledgeBaseTool(
            IKnowledgeBaseService knowledgeBaseService)
        {
            _knowledgeBaseService = knowledgeBaseService;
        }

        public async Task<string> SearchAsync(string query)
        {
            var articles = await _knowledgeBaseService.SearchAsync(query);

            return string.Join(
                "\n\n",
                articles.Select(article =>
                    $"Title: {article.Title}\n{article.Content}"));
        }
    }
}
