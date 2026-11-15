using SupportAiAgent.Api.Application.Abstractions;
using SupportAiAgent.Api.Domain.Entities;

namespace SupportAiAgent.Api.Infrastructure.Gemini.Tools
{
    public sealed class GetTicketDetailsTool
    {
        private readonly ITicketRepository _ticketRepository;

        public GetTicketDetailsTool(ITicketRepository ticketRepository)
        {
            _ticketRepository = ticketRepository;
        }

        public async Task<string> GetTicketDetailsAsync(int ticketId)
        {
            var ticket = await _ticketRepository.GetByIdAsync(ticketId);

            if (ticket is null)
            {
                return $"No ticket found with ID {ticketId}.";
            }

            return $"""
                Ticket ID: {ticket.Id}
                Subject: {ticket.Subject}
                Description: {ticket.Description}
                Status: {ticket.Status}
                Created At: {ticket.CreatedAt}
                """;
        }
    }
}
