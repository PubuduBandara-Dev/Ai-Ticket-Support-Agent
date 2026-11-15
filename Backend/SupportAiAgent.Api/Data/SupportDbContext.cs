namespace SupportAiAgent.Api.Data
{
    using Microsoft.EntityFrameworkCore;
    using SupportAiAgent.Api.Domain.Entities;
    using SupportAiAgent.Api.Infrastructure.Persistence.Converters;

    public class SupportDbContext : DbContext
    {
        public SupportDbContext(DbContextOptions<SupportDbContext> options) : base(options)
        {
        }
        public DbSet<Ticket> Tickets => Set<Ticket>();

        public DbSet<KnowledgeArticle> KnowledgeArticles =>
            Set<KnowledgeArticle>();

        public DbSet<AgentResult> AgentResults =>
            Set<AgentResult>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Ticket>()
                .Property(ticket => ticket.Status)
                .HasConversion<TicketStatusConverter>();

            modelBuilder.Entity<AgentResult>()
                .Property(result => result.Priority)
                .HasConversion<string>();

            modelBuilder.Entity<AgentResult>()
                .Property(result => result.Status)
                .HasConversion<TriageStatusConverter>();

            base.OnModelCreating(modelBuilder);
        }
    }
}
