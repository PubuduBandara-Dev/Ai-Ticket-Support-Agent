using Microsoft.AspNetCore.Mvc;
using SupportAiAgent.Api.Application.Abstractions;
using SupportAiAgent.Api.Application.DTOs.Triage;
using SupportAiAgent.Api.DTO;

namespace SupportAiAgent.Api.Controllers;

[ApiController]
[Route("api/triage")]
public class TriageController : ControllerBase
{
    private readonly ITriageService _triageService;

    public TriageController(ITriageService triageService)
    {
        _triageService = triageService;
    }

    //POST: api/triage/{ticketId}
    [HttpPost("{ticketId:int}")]
    public async Task<IActionResult> RunTriage(int ticketId)
    {
        var result = await _triageService.RunTriageAsync(ticketId);
        return Ok(result);
    }


    // POST: api/triage/{id}/approve
    [HttpPost("{id:int}/approve")]
    public async Task<IActionResult> ApproveTriage(int id)
    {
        var result = await _triageService.ApproveTriageAsync(id);
        return Ok(result);
    }

    // POST: api/triage/{id}/reject
    [HttpPost("{id:int}/reject")]
    public async Task<IActionResult> RejectTriage(
        int id,
        RejectTriageRequest request)
    {
        var result = await _triageService.RejectTriageAsync(
            id,
            new RejectTriageCommand
            {
                Reason = request.Reason
            });
        return Ok(result);
    }
}