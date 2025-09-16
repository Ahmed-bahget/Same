using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
    [Table("Events")]
    [Index(nameof(StartDateTime), nameof(EndDateTime))]
    [Index(nameof(HobbyId))]
    [Index(nameof(Latitude), nameof(Longitude))]
    public class Event
    {
        [Key]
        public Guid EventId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid CreatorUserId { get; set; }

        [Required]
        public Guid HobbyId { get; set; }

        public Guid? PlaceId { get; set; } // Can be at a registered place or custom location

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        // Location (either PlaceId or custom location)
        [StringLength(200)]
        public string? CustomLocationName { get; set; }

        [StringLength(500)]
        public string? CustomLocationAddress { get; set; }

        [Column(TypeName = "decimal(10, 8)")]
        public decimal? Latitude { get; set; }

        [Column(TypeName = "decimal(11, 8)")]
        public decimal? Longitude { get; set; }

        // Timing
        [Required]
        public DateTime StartDateTime { get; set; }

        public DateTime? EndDateTime { get; set; }

        // Participation
        public int MaxParticipants { get; set; } = 50;
        public int CurrentParticipants { get; set; } = 1;

        [Column(TypeName = "decimal(10,2)")]
        public decimal EntryFee { get; set; } = 0.00m;

        public bool RequiresApproval { get; set; } = false;

        // Privacy and status
        public bool IsPublic { get; set; } = true;

        [StringLength(20)]
        public string Status { get; set; } = "Upcoming"; // Upcoming, Ongoing, Completed, Cancelled

        // Media
        [StringLength(1000)] // JSON array
        public string? ImageUrls { get; set; }

        // Social engagement
        public int ViewCount { get; set; } = 0;
        public int ShareCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual User CreatorUser { get; set; } = null!;
        public virtual Hobby Hobby { get; set; } = null!;
        public virtual Place? Place { get; set; }
        public virtual ICollection<EventParticipant> Participants { get; set; } = new List<EventParticipant>();
        public virtual ICollection<EventComment> Comments { get; set; } = new List<EventComment>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
