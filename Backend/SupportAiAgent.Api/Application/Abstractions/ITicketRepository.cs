using SupportAiAgent.Api.Domain.Entities;

namespace SupportAiAgent.Api.Application.Abstractions
{
    public interface ITicketRepository
    {
        Task<Ticket> AddAsync(Ticket ticket);

        Task<IReadOnlyList<Ticket>> GetAllAsync();

        Task<Ticket?> GetByIdAsync(int id);
    }
}
