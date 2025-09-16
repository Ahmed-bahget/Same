using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
    [Table("Messages")]
    [Index(nameof(ConversationId), nameof(CreatedAt))]
    public class Message
    {
        [Key]
        public Guid MessageId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid ConversationId { get; set; }

        [Required]
        public Guid SenderUserId { get; set; }

        [StringLength(20)]
        public string MessageType { get; set; } = "Text"; // Text, Image, File, Order, Location

        [Required]
        public string MessageContent { get; set; } = string.Empty;

        [StringLength(1000)] // JSON array
        public string? AttachmentUrls { get; set; }

        // Special message types
        public Guid? OrderId { get; set; }

        [Column(TypeName = "decimal(10, 8)")]
        public decimal? LocationLatitude { get; set; }

        [Column(TypeName = "decimal(11, 8)")]
        public decimal? LocationLongitude { get; set; }

        public bool IsEdited { get; set; } = false;
        public DateTime? EditedAt { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime? ReadAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual Conversation Conversation { get; set; } = null!;
        public virtual User SenderUser { get; set; } = null!;
        public virtual Order? Order { get; set; }
    }
}
