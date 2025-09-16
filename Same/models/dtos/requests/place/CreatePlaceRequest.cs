using System.ComponentModel.DataAnnotations;

namespace Same.Models.Dtos.Requests.Place
{
    public class CreatePlaceRequest
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        [StringLength(50)]
        public string PlaceType { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Category { get; set; }

        [Required]
        [StringLength(500)]
        public string Address { get; set; } = string.Empty;

        [Required]
        public decimal Latitude { get; set; }

        [Required]
        public decimal Longitude { get; set; }

        public decimal? Area { get; set; }
        public int? Rooms { get; set; }
        public int? Bathrooms { get; set; }
        public string? Features { get; set; }

        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        [StringLength(500)]
        public string? Website { get; set; }

        public string? OpeningHours { get; set; }
        public string? PriceRange { get; set; }

        public bool IsForSale { get; set; } = false;
        public bool IsForRent { get; set; } = false;
        public decimal? SalePrice { get; set; }
        public decimal? RentPriceMonthly { get; set; }
        public decimal? RentPriceDaily { get; set; }

        public List<string>? ImageUrls { get; set; }
    }
}