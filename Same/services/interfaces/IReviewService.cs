using Same.Models.DTOs.Responses;

namespace Same.Services.Interfaces
{
    public interface IReviewService
    {
        // Review Management
        Task<ApiResponse<ReviewResponse>> CreateReviewAsync(Guid reviewerId, CreateReviewRequest request);
        Task<ApiResponse<ReviewResponse>> GetReviewByIdAsync(Guid reviewId);
        Task<ApiResponse<ReviewResponse>> UpdateReviewAsync(Guid reviewId, Guid reviewerId, UpdateReviewRequest request);
        Task<ApiResponse<bool>> DeleteReviewAsync(Guid reviewId, Guid reviewerId);

        // Get Reviews by Entity
        Task<ApiResponse<List<ReviewResponse>>> GetUserReviewsAsync(Guid userId, bool isReviewer = true);
        Task<ApiResponse<List<ReviewResponse>>> GetProductReviewsAsync(Guid productId);
        Task<ApiResponse<List<ReviewResponse>>> GetEventReviewsAsync(Guid eventId);
        Task<ApiResponse<List<ReviewResponse>>> GetPlaceReviewsAsync(Guid placeId);
        Task<ApiResponse<List<ReviewResponse>>> GetDeliveryReviewsAsync(Guid deliveryPersonId);
        Task<ApiResponse<List<ReviewResponse>>> GetBrokerReviewsAsync(Guid brokerId);

        // Rating Analytics
        Task<ApiResponse<double>> GetUserAverageRatingAsync(Guid userId);
        Task<ApiResponse<double>> GetProductAverageRatingAsync(Guid productId);
        Task<ApiResponse<double>> GetEventAverageRatingAsync(Guid eventId);
        Task<ApiResponse<double>> GetPlaceAverageRatingAsync(Guid placeId);
        Task<ApiResponse<object>> GetReviewStatsAsync(Guid entityId, string entityType);

        // Discovery
        Task<ApiResponse<List<ReviewResponse>>> GetRecentReviewsAsync(int count = 10);
        Task<ApiResponse<List<ReviewResponse>>> GetTopReviewsAsync(string entityType, int count = 10);

        // Review Interactions
        Task<ApiResponse<bool>> HelpfulReviewAsync(Guid reviewId, Guid userId, bool isHelpful);
        Task<ApiResponse<bool>> ReportReviewAsync(Guid reviewId, Guid userId, string reason);
    }

    public class CreateReviewRequest
    {
        public Guid ReviewedEntityId { get; set; }
        public string ReviewType { get; set; } = string.Empty; // User, Product, Event, Place, Delivery, Broker
        public int Rating { get; set; } // 1-5 stars
        public string? Title { get; set; }
        public string? Comment { get; set; }
        public List<string>? ImageUrls { get; set; }
        public Guid? RelatedOrderId { get; set; }
        public Guid? RelatedEventId { get; set; }
        public bool IsAnonymous { get; set; } = false;
        
        // Specific rating aspects
        public int? QualityRating { get; set; }
        public int? ServiceRating { get; set; }
        public int? ValueRating { get; set; }
        public int? DeliveryRating { get; set; }
        public int? CommunicationRating { get; set; }
    }

    public class UpdateReviewRequest
    {
        public int? Rating { get; set; }
        public string? Title { get; set; }
        public string? Comment { get; set; }
        public List<string>? ImageUrls { get; set; }
        public bool? IsAnonymous { get; set; }
        
        // Specific rating aspects
        public int? QualityRating { get; set; }
        public int? ServiceRating { get; set; }
        public int? ValueRating { get; set; }
        public int? DeliveryRating { get; set; }
        public int? CommunicationRating { get; set; }
    }
}