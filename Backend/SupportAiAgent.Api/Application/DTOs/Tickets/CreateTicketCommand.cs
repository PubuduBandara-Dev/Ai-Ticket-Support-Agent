namespace SupportAiAgent.Api.Application.DTOs.Tickets
{
    public class CreateTicketCommand
    {
        public string Subject { get; init; } = string.Empty;

        public string Description { get; init; } = string.Empty;
    }
}
