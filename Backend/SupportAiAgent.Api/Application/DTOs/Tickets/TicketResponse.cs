using SupportAiAgent.Api.Domain.Enums;
using System.Text.Json.Serialization;

namespace SupportAiAgent.Api.Application.DTOs.Tickets
{
    public class TicketResponse
    {
        public int Id { get; init; }

        public string Subject { get; init; } = string.Empty;

        public string Description { get; init; } = string.Empty;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TicketStatus Status { get; init; }

        public DateTime CreatedAt { get; init; }
    }
}
