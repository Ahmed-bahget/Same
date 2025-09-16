namespace Same.Models.DTOs.Responses
{
    public class ConnectionResponse
    {
        public Guid ConnectionId { get; set; }
        public UserResponse User { get; set; } = new();
        public string ConnectionType { get; set; } = string.Empty; // Friend, Following, Block
        public string Status { get; set; } = string.Empty; // Pending, Accepted, Declined, Blocked
        public DateTime CreatedAt { get; set; }
    }
}