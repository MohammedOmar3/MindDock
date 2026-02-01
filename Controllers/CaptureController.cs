using Microsoft.AspNetCore.Mvc;
using MindDock.Data;
using MindDock.Models;

namespace MindDock.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CaptureController : ControllerBase
{
    private readonly AppDbContext _db;

    public CaptureController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async System.Threading.Tasks.Task<ActionResult<object>> Capture(CaptureDto dto)
    {
        var text = dto.Text.Trim();

        if (text.StartsWith("todo ", StringComparison.OrdinalIgnoreCase))
        {
            var title = text[5..].Trim();
            var task = new TaskItem { Title = title };
            _db.Tasks.Add(task);
            await _db.SaveChangesAsync();
            return Ok(new { type = "task", id = task.Id, message = "Task created" });
        }

        if (text.StartsWith("note ", StringComparison.OrdinalIgnoreCase))
        {
            var content = text[5..].Trim();
            var title = content.Length > 40 ? content[..40] : content;
            var note = new Note { Title = title, Content = content };
            _db.Notes.Add(note);
            await _db.SaveChangesAsync();
            return Ok(new { type = "note", id = note.Id, message = "Note created" });
        }

        var title2 = text.Length > 40 ? text[..40] : text;
        var note2 = new Note { Title = title2, Content = text };
        _db.Notes.Add(note2);
        await _db.SaveChangesAsync();
        return Ok(new { type = "note", id = note2.Id, message = "Note created" });
    }
}

public record CaptureDto(string Text);
