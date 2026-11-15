using System.Text.Json;
using SupportAiAgent.Api.Application.Abstractions;
using SupportAiAgent.Api.Infrastructure.Gemini.Tools;

namespace SupportAiAgent.Api.Infrastructure.Gemini
{
    public sealed class GeminiToolDispatcher : ITriageToolDispatcher
    {
        private readonly SearchKnowledgeBaseTool _searchKnowledgeBaseTool;
        private readonly GetTicketDetailsTool _getTicketDetailsTool;

        public GeminiToolDispatcher(
            SearchKnowledgeBaseTool searchKnowledgeBaseTool,
            GetTicketDetailsTool getTicketDetailsTool)
        {
            _searchKnowledgeBaseTool = searchKnowledgeBaseTool;
            _getTicketDetailsTool = getTicketDetailsTool;
        }

        public async Task<string> DispatchAsync(
            string functionName,
            JsonElement arguments,
            int currentTicketId)
        {
            switch (functionName)
            {
                case "search_knowledge_base":
                {
                    var query = GetStringArgument(arguments, "query");

                    if (string.IsNullOrWhiteSpace(query))
                    {
                        return "A search query was not provided.";
                    }

                    var result = await _searchKnowledgeBaseTool.SearchAsync(query);

                    return string.IsNullOrWhiteSpace(result)
                        ? "No matching knowledge base articles were found."
                        : result;
                }

                case "get_ticket_details":
                {
                    var requestedId = GetIntArgument(arguments, "ticketId");

                    if (requestedId != currentTicketId)
                    {
                        return "You can only retrieve details for the ticket currently being analyzed.";
                    }

                    return await _getTicketDetailsTool.GetTicketDetailsAsync(
                        requestedId);
                }

                default:
                    throw new InvalidOperationException(
                        $"Unknown Gemini function: {functionName}");
            }
        }

        private static string GetStringArgument(
            JsonElement arguments,
            string name)
        {
            foreach (var property in arguments.EnumerateObject())
            {
                if (string.Equals(
                    property.Name,
                    name,
                    StringComparison.OrdinalIgnoreCase))
                {
                    return property.Value.GetString() ?? string.Empty;
                }
            }

            return string.Empty;
        }

        private static int GetIntArgument(
            JsonElement arguments,
            string name)
        {
            foreach (var property in arguments.EnumerateObject())
            {
                if (string.Equals(
                    property.Name,
                    name,
                    StringComparison.OrdinalIgnoreCase))
                {
                    return property.Value.GetInt32();
                }
            }

            return 0;
        }
    }
}
