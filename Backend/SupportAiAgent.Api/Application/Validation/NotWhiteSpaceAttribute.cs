using System.ComponentModel.DataAnnotations;

namespace SupportAiAgent.Api.Application.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class NotWhiteSpaceAttribute : ValidationAttribute
{
    public NotWhiteSpaceAttribute()
        : base("The {0} field cannot consist only of whitespace.")
    {
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        return value is string text && string.IsNullOrWhiteSpace(text)
            ? new ValidationResult(FormatErrorMessage(validationContext.DisplayName))
            : ValidationResult.Success;
    }
}
