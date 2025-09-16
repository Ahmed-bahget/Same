using System.ComponentModel.DataAnnotations;

namespace Same.Models.DTOs.Requests.Auth
{
    public class UpdateProfileRequest
    {
        [StringLength(50)]
        public string? FirstName { get; set; }

        [StringLength(50)]
        public string? LastName { get; set; }

        [StringLength(1000)]
        public string? Bio { get; set; }

        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(500)]
        public string? ProfileImageUrl { get; set; }

        [StringLength(500)]
        public string? CoverImageUrl { get; set; }

        [StringLength(20)]
        public string? LocationPrivacy { get; set; }
    }
}