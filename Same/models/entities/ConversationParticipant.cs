using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
    [Table("ConversationParticipants")]
    [Index(nameof(ConversationId), nameof(UserId), IsUnique = true)]
    public class ConversationParticipant
    {
        [Key]
        public Guid ParticipantId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid ConversationId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        public DateTime? LastReadAt { get; set; }

        // Navigation Properties
        public virtual Conversation Conversation { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
