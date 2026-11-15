using Microsoft.EntityFrameworkCore;
using SupportAiAgent.Api.Application.Abstractions;
using SupportAiAgent.Api.Data;
using SupportAiAgent.Api.Domain.Entities;

namespace SupportAiAgent.Api.Infrastructure.Persistence.Repositories
{
    public sealed class TicketRepository : ITicketRepository
    {
        private readonly SupportDbContext _db;

        public TicketRepository(SupportDbContext db)
        {
            _db = db;
        }

        public async Task<Ticket> AddAsync(Ticket ticket)
        {
            _db.Tickets.Add(ticket);
            await _db.SaveChangesAsync();
            return ticket;
        }

        public async Task<IReadOnlyList<Ticket>> GetAllAsync()
        {
            return await _db.Tickets
                .AsNoTracking()
                .OrderByDescending(ticket => ticket.CreatedAt)
                .ToListAsync();
        }

        public Task<Ticket?> GetByIdAsync(int id)
        {
            return _db.Tickets
                .AsNoTracking()
                .FirstOrDefaultAsync(ticket => ticket.Id == id);
        }
    }
}
