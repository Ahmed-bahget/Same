using Same.Models.DTOs.Responses;

namespace Same.Services.Interfaces
{
    public interface IProductService
    {
        // Product Management
        Task<ApiResponse<ProductResponse>> CreateProductAsync(Guid sellerId, CreateProductRequest request);
        Task<ApiResponse<ProductResponse>> GetProductByIdAsync(Guid productId);
        Task<ApiResponse<List<ProductResponse>>> GetProductsBySellerAsync(Guid sellerId);
        Task<ApiResponse<List<ProductResponse>>> SearchProductsAsync(SearchProductsRequest request);
        Task<ApiResponse<ProductResponse>> UpdateProductAsync(Guid productId, Guid sellerId, UpdateProductRequest request);
        Task<ApiResponse<bool>> DeleteProductAsync(Guid productId, Guid sellerId);

        // Discovery & Categories
        Task<ApiResponse<List<ProductResponse>>> GetProductsByHobbyAsync(Guid hobbyId);
        Task<ApiResponse<List<ProductResponse>>> GetProductsByPlaceAsync(Guid placeId);
        Task<ApiResponse<List<ProductResponse>>> GetProductsByCategoryAsync(string category);
        Task<ApiResponse<List<ProductResponse>>> GetFeaturedProductsAsync(int count = 10);
        Task<ApiResponse<List<ProductResponse>>> GetNearbyProductsAsync(decimal latitude, decimal longitude, double radiusKm = 10);
        Task<ApiResponse<List<ProductResponse>>> GetRecommendedProductsAsync(Guid userId, int count = 10);

        // Reviews & Ratings
        Task<ApiResponse<List<ReviewResponse>>> GetProductReviewsAsync(Guid productId);
        Task<ApiResponse<double>> GetProductAverageRatingAsync(Guid productId);

        // Favorites & Wishlist
        Task<ApiResponse<bool>> ToggleFavoriteAsync(Guid userId, Guid productId);
        Task<ApiResponse<List<ProductResponse>>> GetUserFavoriteProductsAsync(Guid userId);

    }

    public class CreateProductRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid? HobbyId { get; set; }
        public Guid? PlaceId { get; set; }
        public string Category { get; set; } = string.Empty;
        public string ProductType { get; set; } = "Physical"; // Physical, Service, Digital
        public decimal Price { get; set; }
        public string? ImageUrls { get; set; }
        public string Condition { get; set; } = "New"; // New, Used, Refurbished
        public int StockQuantity { get; set; } = 1;
        public string? Specifications { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public decimal? Weight { get; set; }
        public string? Dimensions { get; set; }
        public bool AllowsNegotiation { get; set; } = false;
        public decimal? MinPrice { get; set; }
        public string DeliveryOptions { get; set; } = "Pickup"; // Pickup, Delivery, Both
        public decimal? ShippingCost { get; set; }
        public string? Location { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        
        // Service-specific fields
        public int? ServiceDurationMinutes { get; set; }
        public string? ServiceAvailability { get; set; }
        public bool RequiresBooking { get; set; } = false;
    }

    public class UpdateProductRequest : CreateProductRequest
    {
        public string? Status { get; set; } // Available, Sold, OutOfStock, Inactive
        public bool? IsActive { get; set; }
        public bool? IsFeatured { get; set; }
    }

    public class SearchProductsRequest
    {
        public string? Name { get; set; }
        public string? Category { get; set; }
        public Guid? HobbyId { get; set; }
        public Guid? PlaceId { get; set; }
        public string? ProductType { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? Condition { get; set; }
        public string? Brand { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public double? RadiusKm { get; set; }
        public bool? AllowsNegotiation { get; set; }
        public bool? InStock { get; set; }
        public string? SortBy { get; set; } // Price, Rating, Distance, Date
        public bool? SortDescending { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}