using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
    [Table("Conversations")]
    public class Conversation
    {
        [Key]
        public Guid ConversationId { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(20)]
        public string ConversationType { get; set; } = string.Empty; // Direct, Group, Event, Order

        public Guid? RelatedEntityId { get; set; } // EventId, OrderId, etc.

        [StringLength(200)]
        public string? Title { get; set; }

        [Required]
        public Guid CreatedBy { get; set; }

        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual User Creator { get; set; } = null!;
        public virtual ICollection<ConversationParticipant> Participants { get; set; } = new List<ConversationParticipant>();
        public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
