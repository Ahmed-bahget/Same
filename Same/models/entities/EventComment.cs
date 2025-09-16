using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
    [Table("EventComments")]
    [Index(nameof(EventId))]
    public class EventComment
    {
        [Key]
        public Guid CommentId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid EventId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [StringLength(1000)]
        public string CommentText { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual Event Event { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }

}

