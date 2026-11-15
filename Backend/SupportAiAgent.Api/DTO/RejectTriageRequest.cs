using System.ComponentModel.DataAnnotations;
using SupportAiAgent.Api.Application.Validation;

namespace SupportAiAgent.Api.DTO
{
    public class RejectTriageRequest
    {
        [Required]
        [NotWhiteSpace]
        [MaxLength(1000)]
        public string Reason { get; set; } = "";
    }
}
