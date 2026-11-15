using Microsoft.AspNetCore.Mvc;
using SupportAiAgent.Api.Application.Abstractions;
using SupportAiAgent.Api.Application.DTOs.Tickets;
using SupportAiAgent.Api.DTO;

namespace SupportAiAgent.Api.Controllers
{
    [ApiController]
    [Route("api/tickets")]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketsController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        // POST: api/tickets
        [HttpPost]
        public async Task<IActionResult> CreateTicket(
            CreateTicketRequest request)
        {
            var ticket = await _ticketService.CreateTicketAsync(
                new CreateTicketCommand
                {
                    Subject = request.Subject,
                    Description = request.Description
                });

            return CreatedAtAction(
                nameof(GetTicket),
                new { id = ticket.Id },
                ticket);
        }

        // GET: api/tickets
        [HttpGet]
        public async Task<IActionResult> GetTickets()
        {
            var tickets = await _ticketService.GetTicketsAsync();
            return Ok(tickets);
        }

        // GET: api/tickets/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetTicket(int id)
        {
            var ticket = await _ticketService.GetTicketAsync(id);

            if (ticket is null)
            {
                return NotFound(new
                {
                    message = $"Ticket {id} was not found."
                });
            }

            return Ok(ticket);
        }
    }
}
