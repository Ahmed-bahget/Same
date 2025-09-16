using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;

namespace Same.Models.Entities
{
    // Hobby Entity
    [Table("Hobbies")]
    [Index(nameof(Name), IsUnique = true)]
    public class Hobby
    {
        [Key]
        public Guid HobbyId { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // Sports, Arts, Music, Cooking, Gaming, Tech, Outdoor, Social

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(500)]
        public string? IconUrl { get; set; }

        public int CommunitySize { get; set; } = 0; // Calculated field

        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual ICollection<UserHobby> UserHobbies { get; set; } = new List<UserHobby>();
        public virtual ICollection<Event> Events { get; set; } = new List<Event>();
    }
}
