using System.ComponentModel.DataAnnotations;

namespace Same.Models.Dtos.Requests.Hobby
{
    public class CreateHobbyRequest
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(500)]
        public string? IconUrl { get; set; }
    }
}