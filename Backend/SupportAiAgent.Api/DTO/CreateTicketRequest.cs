using System.ComponentModel.DataAnnotations;
using SupportAiAgent.Api.Application.Validation;

namespace SupportAiAgent.Api.DTO
{
    public class CreateTicketRequest
    {
        [Required]
        [NotWhiteSpace]
        [MaxLength(200)]
        public string Subject { get; set; } = "";

        [Required]
        [NotWhiteSpace]
        [MaxLength(5000)]
        public string Description { get; set; } = "";
    }
}
