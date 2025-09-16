using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
    [Table("EventParticipants")]
    [Index(nameof(EventId), nameof(UserId), IsUnique = true)]
    public class EventParticipant
    {
        [Key]
        public Guid ParticipantId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid EventId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Registered"; // Registered, Attended, No_Show, Cancelled

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual Event Event { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
