using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
    [Table("Reviews")]
    [Index(nameof(ReviewerUserId))]
    [Index(nameof(ReviewedUserId))]
    [Index(nameof(PlaceId))]
    [Index(nameof(ProductId))]
    [Index(nameof(EventId))]
    public class Review
    {
        [Key]
        public Guid ReviewId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid ReviewerUserId { get; set; }

        public Guid? ReviewedUserId { get; set; } // For user reviews (delivery, broker)
        public Guid? PlaceId { get; set; }
        public Guid? ProductId { get; set; }
        public Guid? EventId { get; set; }
        public Guid? OrderId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [StringLength(200)]
        public string? Title { get; set; }

        [StringLength(1000)]
        public string? ReviewText { get; set; }

        [StringLength(1000)] // JSON array
        public string? ImageUrls { get; set; }

        public bool IsVerifiedPurchase { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual User ReviewerUser { get; set; } = null!;
        public virtual User? ReviewedUser { get; set; }
        public virtual Place? Place { get; set; }
        public virtual Product? Product { get; set; }
        public virtual Event? Event { get; set; }
        public virtual Order? Order { get; set; }
    }
}
