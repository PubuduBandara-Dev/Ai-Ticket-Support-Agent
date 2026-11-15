namespace SupportAiAgent.Api.Domain.Entities
{
    public class KnowledgeArticle
    {
        public int Id { get; set; }

        public string Title { get; set; } = "";

        public string Content { get; set; } = "";

        public string Category { get; set; } = "";
    }
}
