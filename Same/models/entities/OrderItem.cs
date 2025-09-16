using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
    [Table("OrderItems")]
    [Index(nameof(OrderId))]
    public class OrderItem
    {
        [Key]
        public Guid OrderItemId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid OrderId { get; set; }

        public Guid? ProductId { get; set; }
        public Guid? PlaceId { get; set; } // For property transactions

        [Required]
        [StringLength(200)]
        public string ItemName { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ItemDescription { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal UnitPrice { get; set; }

        [Required]
        public int Quantity { get; set; } = 1;

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalPrice { get; set; }

        // Service specific
        public DateTime? ServiceDate { get; set; }
        public int? ServiceDuration { get; set; } // Minutes

        // Navigation Properties
        public virtual Order Order { get; set; } = null!;
        public virtual Product? Product { get; set; }
        public virtual Place? Place { get; set; }
    }
}
