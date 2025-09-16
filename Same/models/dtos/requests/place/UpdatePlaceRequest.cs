using System.ComponentModel.DataAnnotations;

namespace Same.Models.Dtos.Requests.Place
{
    public class UpdatePlaceRequest
    {
        [StringLength(200)]
        public string? Name { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }

        [StringLength(50)]
        public string? PlaceType { get; set; }

        [StringLength(50)]
        public string? Category { get; set; }

        [StringLength(500)]
        public string? Address { get; set; }

        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }

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

        public bool? IsForSale { get; set; }
        public bool? IsForRent { get; set; }
        public decimal? SalePrice { get; set; }
        public decimal? RentPriceMonthly { get; set; }
        public decimal? RentPriceDaily { get; set; }
        public string? AvailabilityStatus { get; set; }

        public List<string>? ImageUrls { get; set; }
        public bool? IsActive { get; set; }
    }
}