using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindDock.Data;
using MindDock.Models;
using System.Text.Json.Serialization;

namespace MindDock.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;

    public TasksController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async System.Threading.Tasks.Task<ActionResult<IEnumerable<TaskItem>>> GetAll()
    {
        return await _db.Tasks.OrderBy(t => t.DueDate).ToListAsync();
    }

    [HttpGet("{id}")]
    public async System.Threading.Tasks.Task<ActionResult<TaskItem>> GetById(Guid id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task == null)
            return NotFound();
        return task;
    }

    [HttpPost]
    public async System.Threading.Tasks.Task<ActionResult<TaskItem>> Create(CreateTaskDto dto)
    {
        var task = new TaskItem { Title = dto.Title, DueDate = DateTime.UtcNow };
        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    }

    [HttpPut("{id}")]
    public async System.Threading.Tasks.Task<ActionResult<TaskItem>> Update(Guid id, UpdateTaskDto dto)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task == null)
            return NotFound();

        task.Status = dto.Status;
        task.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(task);
    }
}

public record CreateTaskDto(string Title);

public class UpdateTaskDto
{
    [JsonPropertyName("status")]
    public Models.TaskStatus Status { get; set; }
}
