using System.ComponentModel.DataAnnotations;

namespace Same.Models.DTOs.Requests.Hobby
{
    public class AddUserHobbyRequest
    {
        [Required]
        public Guid HobbyId { get; set; }

        [StringLength(20)]
        public string SkillLevel { get; set; } = "Beginner"; // Beginner, Intermediate, Advanced, Expert

        [Range(0, 100)]
        public int YearsExperience { get; set; } = 0;

        [StringLength(500)]
        public string? PersonalDescription { get; set; }

        public bool IsPublic { get; set; } = true;
    }
}