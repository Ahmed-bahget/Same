using Same.Models.DTOs.Responses;

namespace Same.Services.Interfaces
{
    public interface IEventService
    {
        // Event Management
        Task<ApiResponse<EventResponse>> CreateEventAsync(Guid creatorId, CreateEventRequest request);
        Task<ApiResponse<EventResponse>> GetEventByIdAsync(Guid eventId, Guid? currentUserId = null);
        Task<ApiResponse<List<EventResponse>>> GetEventsByCreatorAsync(Guid creatorId);
        Task<ApiResponse<List<EventResponse>>> SearchEventsAsync(SearchEventsRequest request, Guid? currentUserId = null);
        Task<ApiResponse<EventResponse>> UpdateEventAsync(Guid eventId, Guid creatorId, UpdateEventRequest request);
        Task<ApiResponse<bool>> DeleteEventAsync(Guid eventId, Guid creatorId);

        // Event Participation
        Task<ApiResponse<bool>> JoinEventAsync(Guid eventId, Guid userId);
        Task<ApiResponse<bool>> LeaveEventAsync(Guid eventId, Guid userId);
        Task<ApiResponse<List<UserResponse>>> GetEventParticipantsAsync(Guid eventId);
        Task<ApiResponse<List<EventResponse>>> GetUserEventsAsync(Guid userId);
        Task<ApiResponse<bool>> InviteToEventAsync(Guid eventId, Guid creatorId, List<Guid> userIds);

        // Location & Discovery
        Task<ApiResponse<List<EventResponse>>> GetNearbyEventsAsync(decimal latitude, decimal longitude, double radiusKm = 10, Guid? currentUserId = null);
        Task<ApiResponse<List<EventResponse>>> GetEventsByHobbyAsync(Guid hobbyId, Guid? currentUserId = null);
        Task<ApiResponse<List<EventResponse>>> GetEventsByPlaceAsync(Guid placeId, Guid? currentUserId = null);
        Task<ApiResponse<List<EventResponse>>> GetUpcomingEventsAsync(Guid userId, int days = 7);
        Task<ApiResponse<List<EventResponse>>> GetPopularEventsAsync(int count = 10, Guid? currentUserId = null);

    }

    public class CreateEventRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid? HobbyId { get; set; }
        public Guid? PlaceId { get; set; }
        public string? Location { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? MaxParticipants { get; set; }
        public decimal? Price { get; set; }
        public string? ImageUrl { get; set; }
        public string? Requirements { get; set; }
        public string PrivacyLevel { get; set; } = "Public"; // Public, Friends, Private
        public bool IsRecurring { get; set; } = false;
        public string? RecurrencePattern { get; set; }
    }

    public class UpdateEventRequest : CreateEventRequest
    {
        public bool? IsActive { get; set; }
        public string? Status { get; set; } // Scheduled, Ongoing, Completed, Cancelled
    }

    public class SearchEventsRequest
    {
        public string? Title { get; set; }
        public Guid? HobbyId { get; set; }
        public Guid? PlaceId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public double? RadiusKm { get; set; }
        public string? PrivacyLevel { get; set; }
        public bool? HasAvailableSlots { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}