using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
    [Table("Orders")]
    [Index(nameof(Status))]
    [Index(nameof(BuyerUserId))]
    [Index(nameof(SellerUserId))]
    public class Order
    {
        [Key]
        public Guid OrderId { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(50)]
        public string OrderNumber { get; set; } = string.Empty;

        // Parties involved
        [Required]
        public Guid BuyerUserId { get; set; }

        [Required]
        public Guid SellerUserId { get; set; }

        public Guid? DeliveryUserId { get; set; }
        public Guid? BrokerUserId { get; set; }

        [Required]
        [StringLength(20)]
        public string OrderType { get; set; } = string.Empty; // Product, Service, Property_Sale, Property_Rent

        // Financial details
        [Required]
        [Column(TypeName = "decimal(15,2)")]
        public decimal SubtotalAmount { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal DeliveryFee { get; set; } = 0.00m;

        [Column(TypeName = "decimal(10,2)")]
        public decimal BrokerFee { get; set; } = 0.00m;

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal AppCommission { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal TaxAmount { get; set; } = 0.00m;

        [Required]
        [Column(TypeName = "decimal(15,2)")]
        public decimal TotalAmount { get; set; }

        // Payment
        [StringLength(50)]
        public string? PaymentMethod { get; set; }

        [StringLength(20)]
        public string PaymentStatus { get; set; } = "Pending"; // Pending, Paid, Failed, Refunded

        [StringLength(100)]
        public string? PaymentTransactionId { get; set; }

        // Order status
        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Preparing, Ready, In_Transit, Delivered, Completed, Cancelled

        // Delivery information
        [StringLength(20)]
        public string DeliveryType { get; set; } = "Delivery"; // Delivery, Pickup, Digital

        [StringLength(500)]
        public string? PickupAddress { get; set; }

        [Column(TypeName = "decimal(10, 8)")]
        public decimal? PickupLatitude { get; set; }

        [Column(TypeName = "decimal(11, 8)")]
        public decimal? PickupLongitude { get; set; }

        [StringLength(500)]
        public string? DeliveryAddress { get; set; }

        [Column(TypeName = "decimal(10, 8)")]
        public decimal? DeliveryLatitude { get; set; }

        [Column(TypeName = "decimal(11, 8)")]
        public decimal? DeliveryLongitude { get; set; }

        [StringLength(500)]
        public string? DeliveryInstructions { get; set; }

        public DateTime? EstimatedDeliveryTime { get; set; }
        public DateTime? ActualDeliveryTime { get; set; }

        // Service/Property specific
        public DateTime? ServiceDate { get; set; }
        public int? ServiceDuration { get; set; } // Minutes

        [StringLength(500)]
        public string? PropertyContractUrl { get; set; }

        public DateTime? LeaseStartDate { get; set; }
        public DateTime? LeaseEndDate { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual User BuyerUser { get; set; } = null!;
        public virtual User SellerUser { get; set; } = null!;
        public virtual User? DeliveryUser { get; set; }
        public virtual User? BrokerUser { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
