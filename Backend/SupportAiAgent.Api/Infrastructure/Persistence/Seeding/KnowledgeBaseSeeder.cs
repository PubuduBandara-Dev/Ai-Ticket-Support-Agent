namespace SupportAiAgent.Api.Infrastructure.Persistence.Seeding
{
    using Microsoft.EntityFrameworkCore;
    using SupportAiAgent.Api.Data;
    using SupportAiAgent.Api.Domain.Entities;

    public static class KnowledgeBaseSeeder
    {
        public static async Task SeedAsync(
            SupportDbContext context)
        {
            // Avoid inserting duplicate articles
            if (await context.KnowledgeArticles.AnyAsync())
            {
                return;
            }

            var articles = new List<KnowledgeArticle>
            {
                new KnowledgeArticle
                {
                    Title = "Password Reset Troubleshooting",
                    Category = "Account Access",
                    Content = "If a user cannot access their account after resetting their password, verify that the reset was completed successfully. Confirm that the user is using the correct email address. If the issue persists, escalate to the identity management team."
                },

                new KnowledgeArticle
                {
                    Title = "Login Failure Troubleshooting",
                    Category = "Account Access",
                    Content = "If a user cannot log in, verify their username and password, check whether the account is locked, and confirm that the authentication service is operational."
                },

                new KnowledgeArticle
                {
                    Title = "Email Delivery Issues",
                    Category = "Email",
                    Content = "If emails are not being delivered, check spam folders, verify recipient addresses, inspect mail server status, and confirm that mailbox storage limits have not been exceeded."
                },

                new KnowledgeArticle
                {
                    Title = "Payment Failure Troubleshooting",
                    Category = "Payments",
                    Content = "If a payment fails, verify the payment method, check whether the bank declined the transaction, confirm billing information, and review payment gateway availability."
                },

                new KnowledgeArticle
                {
                    Title = "Application Performance Issues",
                    Category = "Performance",
                    Content = "If an application is running slowly, check CPU and memory usage, network connectivity, server response times, and whether background processes are consuming excessive resources."
                },

                new KnowledgeArticle
                {
                    Title = "User Permission Problems",
                    Category = "Permissions",
                    Content = "If a user cannot access a feature, verify their assigned role, check permission settings, confirm group membership, and request administrator approval if access is required."
                },

                new KnowledgeArticle
                {
                    Title = "Software Installation Problems",
                    Category = "Installation",
                    Content = "If software installation fails, verify system requirements, available disk space, administrator privileges, installation files, and operating system compatibility."
                },

                new KnowledgeArticle
                {
                    Title = "Account Lockout Resolution",
                    Category = "Account Access",
                    Content = "If an account is locked after multiple failed login attempts, verify the user's identity and follow the organization's approved account unlock procedure."
                },

                new KnowledgeArticle
                {
                    Title = "Two-Factor Authentication Issues",
                    Category = "Security",
                    Content = "If two-factor authentication fails, verify device time synchronization, check the registered authentication device, and use the approved account recovery process."
                },

                new KnowledgeArticle
                {
                    Title = "Network Connectivity Problems",
                    Category = "Network",
                    Content = "If users cannot connect to the application, check network connectivity, DNS resolution, firewall settings, and server availability."
                },

                new KnowledgeArticle
                {
                    Title = "Database Connection Errors",
                    Category = "Database",
                    Content = "If the application cannot connect to the database, verify database availability, connection settings, credentials, network access, and database service status."
                },

                new KnowledgeArticle
                {
                    Title = "Application Error Troubleshooting",
                    Category = "Application",
                    Content = "If an application displays unexpected errors, review application logs, identify recent deployments, verify service dependencies, and escalate unresolved errors to the development team."
                }
            };

            await context.KnowledgeArticles.AddRangeAsync(articles);

            await context.SaveChangesAsync();
        }
    }
}
