using System.ComponentModel.DataAnnotations;

namespace Same.Models.Dtos.Requests.Chat
{
    public class SendMessageRequest
    {
        [Required]
        public Guid ConversationId { get; set; }

        [Required]
        [StringLength(2000)]
        public string Content { get; set; } = string.Empty;

        public string MessageType { get; set; } = "Text"; // Text, Image, File, Location

        // For image/file messages
        public string? MediaUrl { get; set; }
        public string? MediaType { get; set; }

        // For location messages
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? LocationName { get; set; }

        // Reply to message
        public Guid? ReplyToMessageId { get; set; }
    }
}