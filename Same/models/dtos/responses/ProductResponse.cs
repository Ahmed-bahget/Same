namespace Same.Models.DTOs.Responses
{
    public class ProductResponse
    {
        public Guid ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Physical, Service
        public string Category { get; set; } = string.Empty;
        public Guid? PlaceId { get; set; }
        public string? PlaceName { get; set; }
        public Guid OwnerUserId { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? PriceType { get; set; } // PerItem, PerHour, PerDay, PerService
        public int StockQuantity { get; set; }
        public bool IsAvailable { get; set; }
        public string? ImageUrl { get; set; }
        public List<string> Images { get; set; } = new();
        public List<string> Tags { get; set; } = new();
        public string? Specifications { get; set; }
        public bool RequiresDelivery { get; set; }
        public decimal? DeliveryFee { get; set; }
        public int? DeliveryTimeMinutes { get; set; }
        public double? AverageRating { get; set; }
        public int ReviewCount { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}