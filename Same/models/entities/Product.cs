using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
    [Table("Products")]
    [Index(nameof(PlaceId))]
    [Index(nameof(Category))]
    public class Product
    {
        [Key]
        public Guid ProductId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid PlaceId { get; set; }

        [Required]
        public Guid SellerId { get; set; } // Usually same as Place owner

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [StringLength(50)]
        public string? Category { get; set; }

        // Pricing
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? DiscountPrice { get; set; }

        // Inventory
        public int Stock { get; set; } = 0;
        public int MinOrderQuantity { get; set; } = 1;
        public int MaxOrderQuantity { get; set; } = 999;

        [StringLength(20)]
        public string Unit { get; set; } = "piece"; // piece, kg, liter, hour, day

        // Product specifications
        [StringLength(1000)] // JSON array
        public string? ImageUrls { get; set; }

        [StringLength(1000)] // JSON object
        public string? Specifications { get; set; }

        // Service details
        public bool IsService { get; set; } = false;
        public int ServiceDuration { get; set; } = 0; // Duration in minutes
        public bool RequiresBooking { get; set; } = false;

        // Delivery options
        public bool IsPickupOnly { get; set; } = false;

        [Column(TypeName = "decimal(10,2)")]
        public decimal DeliveryFee { get; set; } = 0.00m;

        public int DeliveryRadius { get; set; } = 5; // km

        // Status and metrics
        public bool IsAvailable { get; set; } = true;
        public int ViewCount { get; set; } = 0;
        public int SalesCount { get; set; } = 0;

        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 0.00m;

        public int ReviewCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual Place Place { get; set; } = null!;
        public virtual User Seller { get; set; } = null!;
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
