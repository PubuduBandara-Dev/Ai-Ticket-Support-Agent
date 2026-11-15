namespace SupportAiAgent.Api.Domain.Enums
{
    public enum TriageStatus
    {
        PendingApproval,
        Approved,
        Rejected
    }

    public static class TriageStatusExtensions
    {
        public static string ToLabel(this TriageStatus status)
        {
            return status switch
            {
                TriageStatus.PendingApproval => "Pending Approval",
                TriageStatus.Approved => "Approved",
                TriageStatus.Rejected => "Rejected",
                _ => throw new ArgumentOutOfRangeException(nameof(status))
            };
        }

        public static TriageStatus FromLabel(string label)
        {
            return label switch
            {
                "Pending Approval" or "PendingApproval" =>
                    TriageStatus.PendingApproval,
                "Approved" => TriageStatus.Approved,
                "Rejected" => TriageStatus.Rejected,
                _ => throw new ArgumentOutOfRangeException(
                    nameof(label),
                    label,
                    "Unsupported triage status.")
            };
        }
    }
}
