using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SupportAiAgent.Api.Domain.Enums;

namespace SupportAiAgent.Api.Infrastructure.Persistence.Converters;

public sealed class TicketStatusConverter : ValueConverter<TicketStatus, string>
{
    public TicketStatusConverter()
        : base(
            status => status == TicketStatus.InProgress
                ? "In Progress"
                : status.ToString(),
            value => ParseTicketStatus(value))
    {
    }

    private static TicketStatus ParseTicketStatus(string value)
    {
        var normalizedValue = value.Replace(" ", string.Empty);
        if (Enum.TryParse<TicketStatus>(
                normalizedValue,
                ignoreCase: true,
                out var status) &&
            Enum.IsDefined(status))
        {
            return status;
        }

        throw new InvalidOperationException(
            $"Ticket status '{value}' is not supported.");
    }
}

public sealed class TriageStatusConverter : ValueConverter<TriageStatus, string>
{
    public TriageStatusConverter()
        : base(
            status => status.ToLabel(),
            value => TriageStatusExtensions.FromLabel(value))
    {
    }
}
