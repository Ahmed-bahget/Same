using System.ComponentModel.DataAnnotations;


namespace Same.Models.DTOs.Requests.User
{
    public class UpdateLocationRequest
    {
        [Required]
        public decimal Latitude { get; set; }

        [Required]
        public decimal Longitude { get; set; }

        [StringLength(500)]
        public string? Address { get; set; }

        [StringLength(20)]
        public string Privacy { get; set; } = "Friends"; // Public, Friends, Private
    }
}