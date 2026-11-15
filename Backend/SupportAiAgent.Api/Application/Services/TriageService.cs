using SupportAiAgent.Api.Application.Abstractions;
using SupportAiAgent.Api.Application.DTOs.Triage;
using SupportAiAgent.Api.Domain.Entities;
using SupportAiAgent.Api.Domain.Enums;
using SupportAiAgent.Api.Domain.Exceptions;

namespace SupportAiAgent.Api.Application.Services
{
    public sealed class TriageService : ITriageService
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly IAgentResultRepository _agentResultRepository;
        private readonly IGeminiClient _geminiClient;
        private readonly ITriageResultParser _triageResultParser;

        public TriageService(
            ITicketRepository ticketRepository,
            IAgentResultRepository agentResultRepository,
            IGeminiClient geminiClient,
            ITriageResultParser triageResultParser)
        {
            _ticketRepository = ticketRepository;
            _agentResultRepository = agentResultRepository;
            _geminiClient = geminiClient;
            _triageResultParser = triageResultParser;
        }

        public async Task<TriageResponse> RunTriageAsync(int ticketId)
        {
            var ticket = await _ticketRepository.GetByIdAsync(ticketId);
            if (ticket is null)
            {
                throw new TicketNotFoundException(ticketId);
            }

            var response = await _geminiClient.GenerateTriageAsync(ticket);
            if (string.IsNullOrWhiteSpace(response))
            {
                throw new InvalidOperationException(
                    "Gemini returned an empty response.");
            }

            var result = _triageResultParser.Parse(response);
            result.TicketId = ticket.Id;
            result.Status = TriageStatus.PendingApproval;
            result.CreatedAt = DateTime.UtcNow;

            await _agentResultRepository.AddAsync(result);

            return ToResponse(result);
        }

        public async Task<TriageResponse> ApproveTriageAsync(int id)
        {
            var result = await _agentResultRepository.GetByIdAsync(id);

            if (result is null)
            {
                throw new TriageResultNotFoundException(id);
            }

            EnsurePendingApproval(result);
            result.Status = TriageStatus.Approved;

            await _agentResultRepository.SaveChangesAsync();

            return ToResponse(result);
        }

        public async Task<RejectTriageResponse> RejectTriageAsync(
            int id,
            RejectTriageCommand command)
        {
            var result = await _agentResultRepository.GetByIdAsync(id);

            if (result is null)
            {
                throw new TriageResultNotFoundException(id);
            }

            EnsurePendingApproval(result);
            result.Status = TriageStatus.Rejected;

            await _agentResultRepository.SaveChangesAsync();

            return new RejectTriageResponse
            {
                Id = result.Id,
                Status = result.Status.ToLabel(),
                Reason = command.Reason
            };
        }

        private static TriageResponse ToResponse(AgentResult result)
        {
            return new TriageResponse
            {
                Id = result.Id,
                TicketId = result.TicketId,
                Category = result.Category,
                Priority = result.Priority.ToString(),
                SuggestedResponse = result.SuggestedResponse,
                RecommendedAction = result.RecommendedAction,
                Status = result.Status.ToLabel(),
                CreatedAt = result.CreatedAt
            };
        }

        private static void EnsurePendingApproval(AgentResult result)
        {
            if (result.Status != TriageStatus.PendingApproval)
            {
                throw new TriageAlreadyReviewedException();
            }
        }
    }
}
