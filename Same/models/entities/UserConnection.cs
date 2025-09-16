using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
        [Table("UserConnections")]
    [Index(nameof(RequesterUserId), nameof(ReceiverUserId), nameof(ConnectionType), IsUnique = true)]
    public class UserConnection
    {
        [Key]
        public Guid ConnectionId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid RequesterUserId { get; set; }

        [Required]
        public Guid ReceiverUserId { get; set; }

        [Required]
        [StringLength(20)]
        public string ConnectionType { get; set; } = string.Empty; // Friend, Follow, Block

        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Declined, Blocked

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual User RequesterUser { get; set; } = null!;
        public virtual User ReceiverUser { get; set; } = null!;
    }
}