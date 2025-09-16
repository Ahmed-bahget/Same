using System.ComponentModel.DataAnnotations;

namespace Same.Models.Dtos.Requests.Event
{
    public class JoinEventRequest
    {
        [Required]
        public Guid EventId { get; set; }

        [StringLength(500)]
        public string? Message { get; set; }

        public bool PayEntryFee { get; set; } = false;
    }
}