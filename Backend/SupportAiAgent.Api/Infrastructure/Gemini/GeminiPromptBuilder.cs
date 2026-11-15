using System.Text.Json;
using System.Text.Json.Nodes;
using SupportAiAgent.Api.Application.Abstractions;
using SupportAiAgent.Api.Domain.Entities;

namespace SupportAiAgent.Api.Infrastructure.Gemini
{
    public sealed class GeminiPromptBuilder : ITriagePromptBuilder
    {
        private const string SystemInstructions = """
            You are an AI support ticket triage assistant.

            Your responsibilities:
            1. Identify the ticket category.
            2. Assign priority based on business impact and urgency.
            3. Search the knowledge base for relevant information.
            4. Recommend the next action.
            5. Generate a professional suggested response.

            Rules:
            - Do not invent information.
            - Use the knowledge base when relevant.
            - If information is insufficient, recommend human review.
            - Do not modify customer accounts or ticket records.
            - Do not approve your own recommendations.
            - Priority must be Low, Medium, High, or Critical.
            - Use the available tools when relevant.
            - Return only valid JSON.
            - Do not include Markdown code fences.

            Return this exact JSON structure:
            {
                "Category": "Account Access",
                "Priority": "High",
                "SuggestedResponse": "Professional response",
                "RecommendedAction": "Recommended next action"
            }
            """;

        public JsonObject Build(Ticket ticket)
        {
            var contents = new JsonArray
            {
                new JsonObject
                {
                    ["role"] = "user",
                    ["parts"] = new JsonArray
                    {
                        new JsonObject
                        {
                            ["text"] = $"""
                                Analyze this support ticket.

                                Ticket ID: {ticket.Id}
                                Subject: {ticket.Subject}
                                Description: {ticket.Description}
                                Current Status: {ticket.Status}

                                Use available tools when relevant.
                                Return the final result as JSON.
                                """
                        }
                    }
                }
            };

            var functionDeclarations = new object[]
            {
                new
                {
                    name = "search_knowledge_base",
                    description =
                        "Search the support knowledge base for relevant articles.",
                    parameters = new
                    {
                        type = "OBJECT",
                        properties = new
                        {
                            query = new
                            {
                                type = "STRING",
                                description =
                                    "The topic or issue to search for."
                            }
                        },
                        required = new[] { "query" }
                    }
                },
                new
                {
                    name = "get_ticket_details",
                    description =
                        "Retrieve details of a support ticket.",
                    parameters = new
                    {
                        type = "OBJECT",
                        properties = new
                        {
                            ticketId = new
                            {
                                type = "INTEGER",
                                description = "The ticket ID."
                            }
                        },
                        required = new[] { "ticketId" }
                    }
                }
            };

            return new JsonObject
            {
                ["systemInstruction"] = new JsonObject
                {
                    ["parts"] = new JsonArray
                    {
                        new JsonObject
                        {
                            ["text"] = SystemInstructions
                        }
                    }
                },
                ["contents"] = contents,
                ["tools"] = JsonSerializer.SerializeToNode(
                    new[]
                    {
                        new { functionDeclarations }
                    }),
                ["generationConfig"] = JsonSerializer.SerializeToNode(new
                {
                    responseMimeType = "application/json",
                    responseSchema = new
                    {
                        type = "OBJECT",
                        properties = new
                        {
                            Category = new { type = "STRING" },
                            Priority = new { type = "STRING" },
                            SuggestedResponse = new { type = "STRING" },
                            RecommendedAction = new { type = "STRING" }
                        },
                        required = new[]
                        {
                            "Category",
                            "Priority",
                            "SuggestedResponse",
                            "RecommendedAction"
                        }
                    }
                })
            };
        }
    }
}
