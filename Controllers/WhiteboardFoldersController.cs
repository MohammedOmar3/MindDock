using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindDock.Data;
using MindDock.Models;

namespace MindDock.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WhiteboardFoldersController : ControllerBase
{
    private readonly AppDbContext _db;

    public WhiteboardFoldersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async System.Threading.Tasks.Task<ActionResult<IEnumerable<WhiteboardFolderDto>>> GetAll()
    {
        var folders = await _db.WhiteboardFolders
            .Include(f => f.Documents)
            .OrderBy(f => f.Name)
            .ToListAsync();
        
        return folders.Select(f => MapToDto(f)).ToList();
    }

    [HttpGet("{id}")]
    public async System.Threading.Tasks.Task<ActionResult<WhiteboardFolderDto>> GetById(Guid id)
    {
        var folder = await _db.WhiteboardFolders
            .Include(f => f.Documents)
            .FirstOrDefaultAsync(f => f.Id == id);
        
        if (folder == null)
            return NotFound();
        
        return MapToDto(folder);
    }

    [HttpPost]
    public async System.Threading.Tasks.Task<ActionResult<WhiteboardFolderDto>> Create(CreateWhiteboardFolderDto dto)
    {
        var folder = new WhiteboardFolder { Name = dto.Name };
        _db.WhiteboardFolders.Add(folder);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = folder.Id }, MapToDto(folder));
    }

    [HttpPut("{id}")]
    public async System.Threading.Tasks.Task<ActionResult<WhiteboardFolderDto>> Update(Guid id, UpdateWhiteboardFolderDto dto)
    {
        var folder = await _db.WhiteboardFolders.FindAsync(id);
        if (folder == null)
            return NotFound();

        folder.Name = dto.Name;
        folder.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(MapToDto(folder));
    }

    [HttpDelete("{id}")]
    public async System.Threading.Tasks.Task<IActionResult> Delete(Guid id)
    {
        var folder = await _db.WhiteboardFolders.FindAsync(id);
        if (folder == null)
            return NotFound();

        _db.WhiteboardFolders.Remove(folder);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static WhiteboardFolderDto MapToDto(WhiteboardFolder folder)
    {
        return new WhiteboardFolderDto(
            folder.Id,
            folder.Name,
            folder.CreatedAt,
            folder.UpdatedAt,
            folder.Documents.Select(d => new WhiteboardDocumentSummary(d.Id, d.Title, d.FolderId)).ToList()
        );
    }
}

public record CreateWhiteboardFolderDto(string Name);
public record UpdateWhiteboardFolderDto(string Name);
public record WhiteboardFolderDto(Guid Id, string Name, DateTime CreatedAt, DateTime UpdatedAt, List<WhiteboardDocumentSummary> Documents);
public record WhiteboardDocumentSummary(Guid Id, string Title, Guid? FolderId);
