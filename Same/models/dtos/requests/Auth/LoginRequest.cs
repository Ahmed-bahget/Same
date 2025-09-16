using System.ComponentModel.DataAnnotations;

namespace Same.Models.DTOs.Requests.Auth
{
    public class LoginRequest
    {
        [Required]
        public string EmailOrUsername { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        public bool RememberMe { get; set; } = false;
    }
}




