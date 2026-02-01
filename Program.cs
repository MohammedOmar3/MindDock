using Microsoft.EntityFrameworkCore;
using MindDock.Data;
using MindDock.Models;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add SQLite database
var dbPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "minddock.db");
var absolutePath = Path.GetFullPath(dbPath);
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite($"Data Source={absolutePath}"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

var app = builder.Build();

// Apply migrations at startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseCors("AllowFrontend");
app.MapControllers();

app.Run();
