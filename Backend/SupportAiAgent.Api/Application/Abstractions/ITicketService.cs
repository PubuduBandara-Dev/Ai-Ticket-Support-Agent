using SupportAiAgent.Api.Application.DTOs.Tickets;

namespace SupportAiAgent.Api.Application.Abstractions
{
    public interface ITicketService
    {
        Task<TicketResponse> CreateTicketAsync(CreateTicketCommand command);

        Task<IReadOnlyList<TicketResponse>> GetTicketsAsync();

        Task<TicketResponse?> GetTicketAsync(int id);
    }
}
