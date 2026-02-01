using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindDock.Data;
using MindDock.Models;

namespace MindDock.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WhiteboardsController : ControllerBase
{
    private readonly AppDbContext _db;

    public WhiteboardsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async System.Threading.Tasks.Task<ActionResult<IEnumerable<WhiteboardDocument>>> GetAll()
    {
        return await _db.Whiteboards.OrderByDescending(w => w.UpdatedAt).ToListAsync();
    }

    [HttpGet("{id}")]
    public async System.Threading.Tasks.Task<ActionResult<WhiteboardDocument>> GetById(Guid id)
    {
        var whiteboard = await _db.Whiteboards.FindAsync(id);
        if (whiteboard == null)
            return NotFound();
        return whiteboard;
    }

    [HttpPost]
    public async System.Threading.Tasks.Task<ActionResult<WhiteboardDocument>> Create(CreateWhiteboardDto dto)
    {
        var whiteboard = new WhiteboardDocument 
        { 
            Title = dto.Title, 
            ExcalidrawJson = dto.ExcalidrawJson,
            FolderId = dto.FolderId
        };
        _db.Whiteboards.Add(whiteboard);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = whiteboard.Id }, whiteboard);
    }

    [HttpPut("{id}")]
    public async System.Threading.Tasks.Task<ActionResult<WhiteboardDocument>> Update(Guid id, UpdateWhiteboardDto dto)
    {
        var whiteboard = await _db.Whiteboards.FindAsync(id);
        if (whiteboard == null)
            return NotFound();

        whiteboard.Title = dto.Title;
        whiteboard.ExcalidrawJson = dto.ExcalidrawJson;
        whiteboard.FolderId = dto.FolderId;
        whiteboard.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(whiteboard);
    }

    [HttpDelete("{id}")]
    public async System.Threading.Tasks.Task<IActionResult> Delete(Guid id)
    {
        var whiteboard = await _db.Whiteboards.FindAsync(id);
        if (whiteboard == null)
            return NotFound();

        _db.Whiteboards.Remove(whiteboard);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateWhiteboardDto(string Title, string ExcalidrawJson, Guid? FolderId = null);
public record UpdateWhiteboardDto(string Title, string ExcalidrawJson, Guid? FolderId = null);
