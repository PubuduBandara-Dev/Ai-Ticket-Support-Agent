using System.Text.Json;
using SupportAiAgent.Api.Application.Abstractions;
using SupportAiAgent.Api.Domain.Exceptions;
using SupportAiAgent.Api.Domain.Entities;
using SupportAiAgent.Api.Domain.Enums;

namespace SupportAiAgent.Api.Application.Services;

public sealed class TriageResultParser : ITriageResultParser
{
    public AgentResult Parse(string response)
    {
        var result = JsonSerializer.Deserialize<GeneratedTriageResult>(
            response,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

        if (result is null ||
            string.IsNullOrWhiteSpace(result.Category) ||
            string.IsNullOrWhiteSpace(result.Priority) ||
            string.IsNullOrWhiteSpace(result.SuggestedResponse) ||
            string.IsNullOrWhiteSpace(result.RecommendedAction))
        {
            throw new InvalidTriageResultException(
                "Gemini returned an invalid triage result.");
        }

        if (!Enum.TryParse<TriagePriority>(
                result.Priority,
                ignoreCase: false,
                out var priority) ||
            !Enum.IsDefined(priority) ||
            !string.Equals(
                priority.ToString(),
                result.Priority,
                StringComparison.Ordinal))
        {
            throw new InvalidTriageResultException(
                "Gemini returned an unsupported priority.");
        }

        return new AgentResult
        {
            Category = result.Category,
            Priority = priority,
            SuggestedResponse = result.SuggestedResponse,
            RecommendedAction = result.RecommendedAction
        };
    }

    private sealed class GeneratedTriageResult
    {
        public string Category { get; init; } = string.Empty;

        public string Priority { get; init; } = string.Empty;

        public string SuggestedResponse { get; init; } = string.Empty;

        public string RecommendedAction { get; init; } = string.Empty;
    }
}
