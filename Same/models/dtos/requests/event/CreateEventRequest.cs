using System.ComponentModel.DataAnnotations;

namespace Same.Models.Dtos.Requests.Event
{
    public class CreateEventRequest
    {
        [Required]
        public Guid HobbyId { get; set; }

        public Guid? PlaceId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        // Custom location (if not using PlaceId)
        [StringLength(200)]
        public string? CustomLocationName { get; set; }

        [StringLength(500)]
        public string? CustomLocationAddress { get; set; }

        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }

        // Timing
        [Required]
        public DateTime StartDateTime { get; set; }

        public DateTime? EndDateTime { get; set; }

        // Participation
        public int MaxParticipants { get; set; } = 50;
        public decimal EntryFee { get; set; } = 0.00m;
        public bool RequiresApproval { get; set; } = false;

        // Privacy
        public bool IsPublic { get; set; } = true;

        // Media
        public List<string>? ImageUrls { get; set; }
    }
}