using Same.Models.DTOs.Responses;

namespace Same.Services.Interfaces
{
    public interface IPlaceService
    {
        // Place Management
        Task<ApiResponse<PlaceResponse>> CreatePlaceAsync(Guid ownerId, CreatePlaceRequest request);
        Task<ApiResponse<PlaceResponse>> GetPlaceByIdAsync(Guid placeId);
        Task<ApiResponse<List<PlaceResponse>>> GetPlacesByOwnerAsync(Guid ownerId);
        Task<ApiResponse<List<PlaceResponse>>> SearchPlacesAsync(SearchPlacesRequest request);
        Task<ApiResponse<PlaceResponse>> UpdatePlaceAsync(Guid placeId, Guid ownerId, UpdatePlaceRequest request);
        Task<ApiResponse<bool>> DeletePlaceAsync(Guid placeId, Guid ownerId);

        // Discovery & Location
        Task<ApiResponse<List<PlaceResponse>>> GetNearbyPlacesAsync(decimal latitude, decimal longitude, double radiusKm = 10);
        Task<ApiResponse<List<PlaceResponse>>> GetPlacesByTypeAsync(string placeType);
        Task<ApiResponse<List<PlaceResponse>>> GetPopularPlacesAsync(int count = 10);

        // Business Features
        Task<ApiResponse<List<ProductResponse>>> GetPlaceProductsAsync(Guid placeId);
        Task<ApiResponse<List<EventResponse>>> GetPlaceEventsAsync(Guid placeId);
        Task<ApiResponse<List<ReviewResponse>>> GetPlaceReviewsAsync(Guid placeId);
        Task<ApiResponse<bool>> ToggleFavoriteAsync(Guid userId, Guid placeId);
        Task<ApiResponse<List<PlaceResponse>>> GetUserFavoritePlacesAsync(Guid userId);

        // Rental & Sales
        Task<ApiResponse<List<PlaceResponse>>> GetPlacesForSaleAsync(SearchPlacesRequest request);
        Task<ApiResponse<List<PlaceResponse>>> GetPlacesForRentAsync(SearchPlacesRequest request);
        Task<ApiResponse<bool>> UpdateAvailabilityAsync(Guid placeId, Guid ownerId, string status);

    }

    public class CreatePlaceRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string PlaceType { get; set; } = string.Empty; // Restaurant, Gym, Park, Property, Store, etc.
        public string? Category { get; set; }
        public string Address { get; set; } = string.Empty;
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }

        // Property Details
        public decimal? Area { get; set; }
        public int? Rooms { get; set; }
        public int? Bathrooms { get; set; }
        public string? Features { get; set; }

        // Business Details
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

        // Media
        public string? ImageUrls { get; set; }
    }

    public class UpdatePlaceRequest : CreatePlaceRequest
    {
        public string? AvailabilityStatus { get; set; } // Available, Occupied, Maintenance, Sold
        public bool? IsActive { get; set; }
    }

    public class SearchPlacesRequest
    {
        public string? Name { get; set; }
        public string? PlaceType { get; set; }
        public string? Category { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool? IsForSale { get; set; }
        public bool? IsForRent { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public double? RadiusKm { get; set; }
        public int? MinRooms { get; set; }
        public decimal? MinArea { get; set; }
        public decimal? MaxArea { get; set; }
        public string? AvailabilityStatus { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}