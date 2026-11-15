using Microsoft.AspNetCore.Mvc;
using SupportAiAgent.Api.Application.Abstractions;

namespace SupportAiAgent.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KnowledgeBaseController : ControllerBase
    {
        private readonly IKnowledgeBaseService _knowledgeBaseService;

        public KnowledgeBaseController(
            IKnowledgeBaseService knowledgeBaseService)
        {
            _knowledgeBaseService = knowledgeBaseService;
        }

        // GET: api/KnowledgeBase
        [HttpGet]
        public async Task<IActionResult> GetAllArticles()
        {
            var articles =
                await _knowledgeBaseService.GetAllArticlesAsync();

            return Ok(articles);
        }

        // GET: api/KnowledgeBase/search?q=password
        [HttpGet("search")]
        public async Task<IActionResult> SearchArticles(
            [FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
            {
                return BadRequest("Please provide a search term.");
            }

            var results =
                await _knowledgeBaseService.SearchAsync(q);

            return Ok(results);
        }
    }
}
