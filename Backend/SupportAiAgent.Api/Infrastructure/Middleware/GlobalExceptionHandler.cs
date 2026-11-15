using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SupportAiAgent.Api.Domain.Exceptions;

namespace SupportAiAgent.Api.Infrastructure.Middleware;

public sealed class GlobalExceptionHandler(
    ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var (statusCode, title, detail) = exception switch
        {
            TicketNotFoundException =>
                (StatusCodes.Status404NotFound,
                    "Not Found",
                    "The requested ticket was not found."),
            TriageResultNotFoundException =>
                (StatusCodes.Status404NotFound,
                    "Not Found",
                    "The requested triage result was not found."),
            TriageAlreadyReviewedException =>
                (StatusCodes.Status409Conflict,
                    "Conflict",
                    "This recommendation has already been reviewed."),
            InvalidTriageResultException =>
                (StatusCodes.Status502BadGateway,
                    "Bad Gateway",
                    "The AI provider returned an invalid triage response."),
            HttpRequestException or JsonException =>
                (StatusCodes.Status502BadGateway,
                    "Bad Gateway",
                    "An upstream service request failed."),
            ArgumentException =>
                (StatusCodes.Status400BadRequest,
                    "Bad Request",
                    "The request could not be processed."),
            _ =>
                (StatusCodes.Status500InternalServerError,
                    "Internal Server Error",
                    "An unexpected error occurred.")
        };

        if (statusCode >= StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "Unhandled API exception: {Title}", title);
        }
        else
        {
            logger.LogWarning(exception, "Handled API exception: {Title}", title);
        }

        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(
            new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = detail,
                Instance = httpContext.Request.Path
            },
            cancellationToken);

        return true;
    }
}
