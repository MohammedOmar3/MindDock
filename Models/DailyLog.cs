namespace MindDock.Models;

public class DailyLog
{
    public Guid Id { get; set; }
    public DateOnly Date { get; set; }
    public string WorkedOn { get; set; } = string.Empty;
    public string Blockers { get; set; } = string.Empty;
    public string Learned { get; set; } = string.Empty;
    public string TomorrowFocus { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
