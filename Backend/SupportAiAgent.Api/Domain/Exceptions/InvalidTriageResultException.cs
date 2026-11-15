namespace SupportAiAgent.Api.Domain.Exceptions;

public sealed class InvalidTriageResultException : InvalidOperationException
{
    public InvalidTriageResultException(string message)
        : base(message)
    {
    }
}
