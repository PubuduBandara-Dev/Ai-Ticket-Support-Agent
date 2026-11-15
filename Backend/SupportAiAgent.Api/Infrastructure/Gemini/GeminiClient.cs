using System.Text;
using System.Text.Json.Nodes;
using SupportAiAgent.Api.Application.Abstractions;
using SupportAiAgent.Api.Domain.Entities;

namespace SupportAiAgent.Api.Infrastructure.Gemini;

public sealed class GeminiClient : IGeminiClient
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ITriagePromptBuilder _promptBuilder;
    private readonly GeminiResponseParser _responseParser;
    private readonly ITriageToolDispatcher _toolDispatcher;

    public GeminiClient(
        HttpClient httpClient,
        IConfiguration configuration,
        ITriagePromptBuilder promptBuilder,
        GeminiResponseParser responseParser,
        ITriageToolDispatcher toolDispatcher)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _promptBuilder = promptBuilder;
        _responseParser = responseParser;
        _toolDispatcher = toolDispatcher;
    }

    public async Task<string> GenerateTriageAsync(Ticket ticket)
    {
        var apiKey = _configuration["Gemini:ApiKey"];
        var model = _configuration["Gemini:Model"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException("Gemini API key is missing.");
        }

        if (string.IsNullOrWhiteSpace(model))
        {
            throw new InvalidOperationException("Gemini model is missing.");
        }

        var url =
            $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent";

        var requestBody = _promptBuilder.Build(ticket);
        var contents = requestBody["contents"]!.AsArray();

        for (var round = 0; round < 5; round++)
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, url);
            request.Headers.Add("x-goog-api-key", apiKey);
            request.Content = new StringContent(
                requestBody.ToJsonString(),
                Encoding.UTF8,
                "application/json");

            using var response = await _httpClient.SendAsync(request);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException(
                    $"Gemini API error ({(int)response.StatusCode}): {responseBody}");
            }

            var parsedResponse = _responseParser.Parse(responseBody);
            contents.Add(parsedResponse.Content);

            if (parsedResponse.FunctionCalls.Count == 0)
            {
                return parsedResponse.Text;
            }

            var functionResponseParts = new JsonArray();

            foreach (var functionCall in parsedResponse.FunctionCalls)
            {
                var result = await _toolDispatcher.DispatchAsync(
                    functionCall.Name ?? "",
                    functionCall.Arguments,
                    ticket.Id);

                var functionResponse = new JsonObject
                {
                    ["name"] = functionCall.Name,
                    ["response"] = new JsonObject
                    {
                        ["result"] = result
                    }
                };

                if (functionCall.HasId)
                {
                    functionResponse["id"] = functionCall.Id;
                }

                functionResponseParts.Add(
                    new JsonObject
                    {
                        ["functionResponse"] = functionResponse
                    });
            }

            contents.Add(
                new JsonObject
                {
                    ["role"] = "user",
                    ["parts"] = functionResponseParts
                });
        }

        throw new InvalidOperationException(
            "Gemini exceeded the maximum number of tool-calling rounds.");
    }
}
