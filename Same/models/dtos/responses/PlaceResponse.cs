namespace Same.Models.DTOs.Responses
{
    public class PlaceResponse
    {
        public Guid PlaceId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Restaurant, Gym, Park, Venue, etc.
        public string Category { get; set; } = string.Empty; // Sports, Food, Entertainment, etc.
        public Guid OwnerUserId { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public string? ImageUrl { get; set; }
        public List<string> Images { get; set; } = new();
        public decimal? PricePerHour { get; set; }
        public decimal? PricePerDay { get; set; }
        public string? WorkingHours { get; set; }
        public List<string> Amenities { get; set; } = new();
        public int Capacity { get; set; }
        public double? AverageRating { get; set; }
        public int ReviewCount { get; set; }
        public bool IsActive { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public double? DistanceFromUser { get; set; }
    }
}