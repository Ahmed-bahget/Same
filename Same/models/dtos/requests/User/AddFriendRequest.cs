using System.ComponentModel.DataAnnotations;

namespace Same.Models.DTOs.Requests.User
{
    public class AddFriendRequest
    {
        [Required]
        public Guid UserId { get; set; }

        [StringLength(20)]
        public string ConnectionType { get; set; } = "Friend"; // Friend, Follow

        [StringLength(200)]
        public string? Message { get; set; }
    }

}
