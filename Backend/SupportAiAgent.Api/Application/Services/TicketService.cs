using SupportAiAgent.Api.Application.Abstractions;
using SupportAiAgent.Api.Application.DTOs.Tickets;
using SupportAiAgent.Api.Domain.Enums;
using SupportAiAgent.Api.Domain.Entities;

namespace SupportAiAgent.Api.Application.Services
{
    public sealed class TicketService : ITicketService
    {
        private readonly ITicketRepository _ticketRepository;

        public TicketService(ITicketRepository ticketRepository)
        {
            _ticketRepository = ticketRepository;
        }

        public async Task<TicketResponse> CreateTicketAsync(
            CreateTicketCommand command)
        {
            var ticket = new Ticket
            {
                Subject = command.Subject,
                Description = command.Description,
                Status = TicketStatus.Open,
                CreatedAt = DateTime.UtcNow
            };

            var createdTicket = await _ticketRepository.AddAsync(ticket);
            return ToResponse(createdTicket);
        }

        public async Task<IReadOnlyList<TicketResponse>> GetTicketsAsync()
        {
            var tickets = await _ticketRepository.GetAllAsync();
            return tickets.Select(ToResponse).ToList();
        }

        public async Task<TicketResponse?> GetTicketAsync(int id)
        {
            var ticket = await _ticketRepository.GetByIdAsync(id);
            return ticket is null ? null : ToResponse(ticket);
        }

        private static TicketResponse ToResponse(Ticket ticket)
        {
            return new TicketResponse
            {
                Id = ticket.Id,
                Subject = ticket.Subject,
                Description = ticket.Description,
                Status = ticket.Status,
                CreatedAt = ticket.CreatedAt
            };
        }
    }
}
