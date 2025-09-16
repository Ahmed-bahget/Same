namespace Same.Models.DTOs.Responses
{
    public class UserResponse
    {
        public Guid UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Bio { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public int Age { get; set; }
        public double? CurrentLatitude { get; set; }
        public double? CurrentLongitude { get; set; }
        public string? LocationAddress { get; set; }
        public string? LocationPrivacy { get; set; }
        public DateTime? LocationUpdatedAt { get; set; }
        public bool IsActive { get; set; }
        public bool IsVerified { get; set; }
        public DateTime JoinDate { get; set; }
        public DateTime? LastLoginAt { get; set; }

        // Relationship status with current user
        public string? RelationshipStatus { get; set; } // null, Pending, Friend, Following, Blocked
        public bool? IsFriend { get; set; }

        // User hobbies
        public List<HobbyResponse>? Hobbies { get; set; } = new();
    }
}
