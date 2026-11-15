using System.Text.Json.Nodes;
using SupportAiAgent.Api.Domain.Entities;

namespace SupportAiAgent.Api.Application.Abstractions
{
    public interface ITriagePromptBuilder
    {
        JsonObject Build(Ticket ticket);
    }
}
