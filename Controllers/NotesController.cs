using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindDock.Data;
using MindDock.Models;

namespace MindDock.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotesController : ControllerBase
{
    private readonly AppDbContext _db;

    public NotesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async System.Threading.Tasks.Task<ActionResult<IEnumerable<Note>>> GetAll()
    {
        return await _db.Notes.OrderByDescending(n => n.UpdatedAt).ToListAsync();
    }

    [HttpGet("{id}")]
    public async System.Threading.Tasks.Task<ActionResult<Note>> GetById(Guid id)
    {
        var note = await _db.Notes.FindAsync(id);
        if (note == null)
            return NotFound();
        return note;
    }

    [HttpPost]
    public async System.Threading.Tasks.Task<ActionResult<Note>> Create(CreateNoteDto dto)
    {
        var note = new Note { Title = dto.Title, Content = dto.Content };
        _db.Notes.Add(note);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = note.Id }, note);
    }

    [HttpPut("{id}")]
    public async System.Threading.Tasks.Task<ActionResult<Note>> Update(Guid id, UpdateNoteDto dto)
    {
        var note = await _db.Notes.FindAsync(id);
        if (note == null)
            return NotFound();

        note.Title = dto.Title;
        note.Content = dto.Content;
        note.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(note);
    }

    [HttpDelete("{id}")]
    public async System.Threading.Tasks.Task<IActionResult> Delete(Guid id)
    {
        var note = await _db.Notes.FindAsync(id);
        if (note == null)
            return NotFound();

        _db.Notes.Remove(note);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateNoteDto(string Title, string Content);
public record UpdateNoteDto(string Title, string Content);
