namespace Same.Models.DTOs.Responses
{
    public class ConversationResponse
    {
        public Guid ConversationId { get; set; }
        public string Type { get; set; } = string.Empty; // Direct, Group, Event, Order
        public string? Title { get; set; }
        public string? ImageUrl { get; set; }
        public List<UserResponse> Participants { get; set; } = new();
        public MessageResponse? LastMessage { get; set; }
        public int UnreadCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsActive { get; set; }
    }

    public class MessageResponse
    {
        public Guid MessageId { get; set; }
        public Guid ConversationId { get; set; }
        public Guid SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string MessageType { get; set; } = string.Empty; // Text, Image, File, Location
        public string? MediaUrl { get; set; }
        public DateTime SentAt { get; set; }
        public DateTime? ReadAt { get; set; }
        public bool IsRead { get; set; }
    }
}