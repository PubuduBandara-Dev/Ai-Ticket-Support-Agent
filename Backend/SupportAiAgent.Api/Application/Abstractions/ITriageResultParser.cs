using SupportAiAgent.Api.Domain.Entities;

namespace SupportAiAgent.Api.Application.Abstractions
{
    public interface ITriageResultParser
    {
        AgentResult Parse(string response);
    }
}
