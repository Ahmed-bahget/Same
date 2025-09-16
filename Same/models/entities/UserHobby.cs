using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
    [Table("UserHobbies")]
    [Index(nameof(UserId), nameof(HobbyId), IsUnique = true)]
    [Index(nameof(HobbyId))]
    public class UserHobby
    {
        [Key]
        public Guid UserHobbyId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid HobbyId { get; set; }

        [StringLength(20)]
        public string SkillLevel { get; set; } = "Beginner"; // Beginner, Intermediate, Advanced, Expert

        public int YearsExperience { get; set; } = 0;

        public bool IsPublic { get; set; } = true;

        [StringLength(500)]
        public string? PersonalDescription { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual Hobby Hobby { get; set; } = null!;
    }
}
