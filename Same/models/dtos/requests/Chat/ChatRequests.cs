namespace Same.Models.DTOs.Requests.Chat
{
    public class CreateConversationRequest
    {
        public string? Title { get; set; }
        public bool IsGroup { get; set; } = false;
        public string ConversationType { get; set; } = "DirectMessage"; // DirectMessage, Group, Event, Order
        public List<Guid> ParticipantIds { get; set; } = new List<Guid>();
        public Guid? RelatedEntityId { get; set; } // EventId, OrderId, etc.
    }

    public class SendMessageRequest
    {
        public string Content { get; set; } = string.Empty;
        public string MessageType { get; set; } = "Text"; // Text, Image, Video, Audio, File, Location
        public string? MediaUrl { get; set; }
        public Guid? ReplyToMessageId { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? LocationName { get; set; }
    }
}