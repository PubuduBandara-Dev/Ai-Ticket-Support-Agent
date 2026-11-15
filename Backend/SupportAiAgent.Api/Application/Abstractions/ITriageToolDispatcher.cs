using System.Text.Json;

namespace SupportAiAgent.Api.Application.Abstractions
{
    public interface ITriageToolDispatcher
    {
        Task<string> DispatchAsync(
            string functionName,
            JsonElement arguments,
            int currentTicketId);
    }
}
