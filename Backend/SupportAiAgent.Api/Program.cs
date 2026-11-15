
using Microsoft.EntityFrameworkCore;
using SupportAiAgent.Api.Application.Abstractions;
using SupportAiAgent.Api.Infrastructure.Gemini;
using SupportAiAgent.Api.Infrastructure.Middleware;
using SupportAiAgent.Api.Infrastructure.Persistence.Repositories;
using SupportAiAgent.Api.Infrastructure.Persistence.Seeding;
using SupportAiAgent.Api.Infrastructure.Gemini.Tools;
using SupportAiAgent.Api.Data;
using TriageApplicationService = SupportAiAgent.Api.Application.Services.TriageService;
using TriageResultParser = SupportAiAgent.Api.Application.Services.TriageResultParser;
using TicketApplicationService = SupportAiAgent.Api.Application.Services.TicketService;
using KnowledgeBaseApplicationService = SupportAiAgent.Api.Application.Services.KnowledgeBaseService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddGlobalExceptionHandling();

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<SupportDbContext>(options =>
    options.UseSqlite("Data Source=support.db"));


builder.Services.AddScoped<IKnowledgeBaseService, KnowledgeBaseApplicationService>();
builder.Services.AddScoped<SearchKnowledgeBaseTool>();
builder.Services.AddScoped<GetTicketDetailsTool>();
builder.Services.AddScoped<ITriageService, TriageApplicationService>();
builder.Services.AddScoped<ITicketService, TicketApplicationService>();
builder.Services.AddScoped<ITicketRepository, TicketRepository>();
builder.Services.AddScoped<IAgentResultRepository, AgentResultRepository>();
builder.Services.AddScoped<IKnowledgeArticleRepository, KnowledgeArticleRepository>();
builder.Services.AddSingleton<ITriagePromptBuilder, GeminiPromptBuilder>();
builder.Services.AddSingleton<ITriageResultParser, TriageResultParser>();
builder.Services.AddSingleton<GeminiResponseParser>();
builder.Services.AddScoped<ITriageToolDispatcher, GeminiToolDispatcher>();
builder.Services.AddHttpClient<IGeminiClient, GeminiClient>();

var app = builder.Build();

app.UseGlobalExceptionHandling();

// Seed knowledge base
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider
        .GetRequiredService<SupportDbContext>();

    await KnowledgeBaseSeeder.SeedAsync(context);
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();

}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
