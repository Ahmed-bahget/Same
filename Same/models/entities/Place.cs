using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
    public class Place
    {
        [Key]
        public Guid PlaceId { get; set; }

        public Guid OwnerId { get; set; }
        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        // Classification
        [Required, MaxLength(50)]
        public string PlaceType { get; set; } = string.Empty;
        public string? Category { get; set; }

        // Location
        [Required, MaxLength(500)]
        public string Address { get; set; } = string.Empty;
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }

        // Property details
        public decimal? Area { get; set; }
        public int? Rooms { get; set; }
        public int? Bathrooms { get; set; }
        public string? Features { get; set; }

        // Business details
        public string? PhoneNumber { get; set; }
        public string? Website { get; set; }
        public string? OpeningHours { get; set; }
        public string? PriceRange { get; set; }

        // Sales/Rental
        public bool IsForSale { get; set; } = false;
        public bool IsForRent { get; set; } = false;
        public decimal? SalePrice { get; set; }
        public decimal? RentPriceMonthly { get; set; }
        public decimal? RentPriceDaily { get; set; }
        public string AvailabilityStatus { get; set; } = "Available";

        // Media & social
        public string? ImageUrls { get; set; }
        public int ViewCount { get; set; } = 0;
        public int FavoriteCount { get; set; } = 0;

        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User Owner { get; set; } = null!;
        public ICollection<Event> Events { get; set; } = new List<Event>();
    }
}
