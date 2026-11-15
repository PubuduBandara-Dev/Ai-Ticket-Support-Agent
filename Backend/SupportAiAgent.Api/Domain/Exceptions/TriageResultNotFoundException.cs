namespace SupportAiAgent.Api.Domain.Exceptions;

public sealed class TriageResultNotFoundException : Exception
{
    public TriageResultNotFoundException(int triageResultId)
        : base($"Triage result {triageResultId} was not found.")
    {
    }
}
