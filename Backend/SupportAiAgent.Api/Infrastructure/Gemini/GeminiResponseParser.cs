using System.Text.Json;
using System.Text.Json.Nodes;

namespace SupportAiAgent.Api.Infrastructure.Gemini
{
    public sealed record GeminiFunctionCall(
        string? Name,
        JsonElement Arguments,
        bool HasId,
        string? Id);

    public sealed record GeminiParsedResponse(
        JsonNode Content,
        IReadOnlyList<GeminiFunctionCall> FunctionCalls,
        string Text);

    public sealed class GeminiResponseParser
    {
        public GeminiParsedResponse Parse(string responseBody)
        {
            using var document = JsonDocument.Parse(responseBody);
            var root = document.RootElement;

            if (!root.TryGetProperty("candidates", out var candidates) ||
                candidates.GetArrayLength() == 0)
            {
                throw new InvalidOperationException(
                    "Gemini returned no response candidates.");
            }

            var candidate = candidates[0];
            if (!candidate.TryGetProperty("content", out var content))
            {
                throw new InvalidOperationException(
                    "Gemini response did not contain content.");
            }

            var parts = content.GetProperty("parts");
            var functionCalls = new List<GeminiFunctionCall>();

            foreach (var part in parts.EnumerateArray())
            {
                if (!part.TryGetProperty("functionCall", out var functionCall))
                {
                    continue;
                }

                var hasArguments = functionCall.TryGetProperty("args", out var arguments);
                var hasId = functionCall.TryGetProperty("id", out var callId);

                functionCalls.Add(new GeminiFunctionCall(
                    functionCall.GetProperty("name").GetString(),
                    hasArguments ? arguments.Clone() : default,
                    hasId,
                    hasId ? callId.GetString() : null));
            }

            var text = string.Join(
                "\n",
                parts.EnumerateArray()
                    .Where(part => part.TryGetProperty("text", out _))
                    .Select(part => part.GetProperty("text").GetString()));

            if (functionCalls.Count == 0 && string.IsNullOrWhiteSpace(text))
            {
                throw new InvalidOperationException(
                    "Gemini returned an empty text response.");
            }

            return new GeminiParsedResponse(
                JsonNode.Parse(content.GetRawText())!,
                functionCalls,
                text);
        }
    }
}
