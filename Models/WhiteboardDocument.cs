namespace MindDock.Models;

public class WhiteboardDocument
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ExcalidrawJson { get; set; } = string.Empty;
    public Guid? FolderId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public WhiteboardFolder? Folder { get; set; }
}
