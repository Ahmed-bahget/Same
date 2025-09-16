using System.ComponentModel.DataAnnotations;

namespace Same.Models.Dtos.Requests.Product
{
    public class CreateProductRequest
    {
        [Required]
        public Guid PlaceId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [StringLength(50)]
        public string? Category { get; set; }

        [Required]
        public decimal Price { get; set; }

        public decimal? DiscountPrice { get; set; }

        public int Stock { get; set; } = 0;
        public int MinOrderQuantity { get; set; } = 1;
        public int MaxOrderQuantity { get; set; } = 999;

        [StringLength(20)]
        public string Unit { get; set; } = "piece";

        public List<string>? ImageUrls { get; set; }
        public Dictionary<string, string>? Specifications { get; set; }

        // Service details
        public bool IsService { get; set; } = false;
        public int ServiceDuration { get; set; } = 0;
        public bool RequiresBooking { get; set; } = false;

        // Delivery options
        public bool IsPickupOnly { get; set; } = false;
        public decimal DeliveryFee { get; set; } = 0.00m;
        public int DeliveryRadius { get; set; } = 5;
    }
}