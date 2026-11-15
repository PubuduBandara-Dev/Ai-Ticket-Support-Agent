namespace SupportAiAgent.Api.Domain.Exceptions;

public sealed class TriageAlreadyReviewedException : Exception
{
    public TriageAlreadyReviewedException()
        : base("This recommendation has already been reviewed.")
    {
    }
}
