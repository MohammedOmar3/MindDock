using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindDock.Data;
using MindDock.Models;

namespace MindDock.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DailyLogsController : ControllerBase
{
    private readonly AppDbContext _db;

    public DailyLogsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async System.Threading.Tasks.Task<ActionResult<IEnumerable<DailyLog>>> GetAll()
    {
        return await _db.DailyLogs.OrderByDescending(d => d.Date).ToListAsync();
    }

    [HttpGet("{date}")]
    public async System.Threading.Tasks.Task<ActionResult<DailyLog>> GetByDate(string date)
    {
        if (!DateOnly.TryParse(date, out var parsedDate))
            return BadRequest("Invalid date format");

        var log = await _db.DailyLogs.FirstOrDefaultAsync(d => d.Date == parsedDate);
        if (log == null)
            return NotFound();
        return log;
    }

    [HttpPost]
    public async System.Threading.Tasks.Task<ActionResult<DailyLog>> Create(CreateDailyLogDto dto)
    {
        // Check if log already exists for this date
        var existing = await _db.DailyLogs.FirstOrDefaultAsync(d => d.Date == dto.Date);
        if (existing != null)
            return Conflict(new { message = "Log already exists for this date" });

        var log = new DailyLog
        {
            Date = dto.Date,
            WorkedOn = dto.WorkedOn,
            Blockers = dto.Blockers,
            Learned = dto.Learned,
            TomorrowFocus = dto.TomorrowFocus
        };
        _db.DailyLogs.Add(log);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetByDate), new { date = dto.Date }, log);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<DailyLog>> Update(Guid id, UpdateDailyLogDto dto)
    {
        var log = await _db.DailyLogs.FindAsync(id);
        if (log == null)
            return NotFound();

        log.WorkedOn = dto.WorkedOn;
        log.Blockers = dto.Blockers;
        log.Learned = dto.Learned;
        log.TomorrowFocus = dto.TomorrowFocus;
        log.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(log);
    }
}

public record CreateDailyLogDto(DateOnly Date, string WorkedOn, string Blockers, string Learned, string TomorrowFocus);
public record UpdateDailyLogDto(string WorkedOn, string Blockers, string Learned, string TomorrowFocus);
