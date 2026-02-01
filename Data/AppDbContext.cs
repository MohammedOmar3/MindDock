using Microsoft.EntityFrameworkCore;
using MindDock.Models;

namespace MindDock.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TaskItem> Tasks { get; set; } = null!;
    public DbSet<DailyLog> DailyLogs { get; set; } = null!;
    public DbSet<Note> Notes { get; set; } = null!;
    public DbSet<WhiteboardFolder> WhiteboardFolders { get; set; } = null!;
    public DbSet<WhiteboardDocument> Whiteboards { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<DailyLog>()
            .HasIndex(d => d.Date)
            .IsUnique();

        modelBuilder.Entity<WhiteboardDocument>()
            .HasOne(d => d.Folder)
            .WithMany(f => f.Documents)
            .HasForeignKey(d => d.FolderId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
