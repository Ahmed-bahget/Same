namespace Same.Models.DTOs.Responses
{
    public class EventResponse
    {
        public Guid EventId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid CreatorUserId { get; set; }
        public string CreatorName { get; set; } = string.Empty;
        public Guid HobbyId { get; set; }
        public string HobbyName { get; set; } = string.Empty;
        public Guid? PlaceId { get; set; }
        public string? PlaceName { get; set; }
        public string? Location { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int MaxParticipants { get; set; }
        public int CurrentParticipants { get; set; }
        public decimal? Price { get; set; }
        public string? ImageUrl { get; set; }
        public string Status { get; set; } = string.Empty; // Upcoming, Live, Completed, Cancelled
        public bool IsPublic { get; set; }
        public bool RequiresApproval { get; set; }
        public string? Requirements { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsParticipant { get; set; }
        public string? ParticipationStatus { get; set; }
    }
}