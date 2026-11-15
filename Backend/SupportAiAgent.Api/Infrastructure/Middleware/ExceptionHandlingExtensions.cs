namespace SupportAiAgent.Api.Infrastructure.Middleware;

public static class ExceptionHandlingExtensions
{
    public static IServiceCollection AddGlobalExceptionHandling(
        this IServiceCollection services)
    {
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();

        return services;
    }

    public static IApplicationBuilder UseGlobalExceptionHandling(
        this IApplicationBuilder app)
    {
        app.UseExceptionHandler();
        app.UseStatusCodePages();

        return app;
    }
}
