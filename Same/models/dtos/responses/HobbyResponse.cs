namespace Same.Models.DTOs.Responses
{
    public class HobbyResponse
    {
        public Guid HobbyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? IconUrl { get; set; }
        public int CommunitySize { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UserHobbyResponse
    {
        public Guid HobbyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string SkillLevel { get; set; } = string.Empty;
        public int YearsExperience { get; set; }
        public string? PersonalDescription { get; set; }
    }
}
