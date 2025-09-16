namespace Same.Models.DTOs.Responses
{
    public class ReviewResponse
    {
        public Guid ReviewId { get; set; }
        public Guid ReviewerUserId { get; set; }
        public string ReviewerName { get; set; } = string.Empty;
        public string? ReviewerProfileImage { get; set; }
        public Guid ReviewedUserId { get; set; }
        public string? ReviewedUserName { get; set; }
        public Guid? PlaceId { get; set; }
        public string? PlaceName { get; set; }
        public Guid? ProductId { get; set; }
        public string? ProductName { get; set; }
        public Guid? EventId { get; set; }
        public string? EventTitle { get; set; }
        public Guid? OrderId { get; set; }
        public int Rating { get; set; } // 1-5
        public string? Title { get; set; }
        public string? Comment { get; set; }
        public List<string> Images { get; set; } = new();
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}