using System.ComponentModel.DataAnnotations;


namespace Same.Models.DTOs.Requests.User
{
    public class UpdateRoleRequest
    {
        [Required]
        [StringLength(50)]
        public string RoleType { get; set; } = string.Empty;

        public bool IsActive { get; set; }

        public int? ServiceRadius { get; set; }

        public decimal? HourlyRate { get; set; }

        public decimal? CommissionRate { get; set; }

        public object? WorkingHours { get; set; } // Will be serialized to JSON

        public List<string>? VerificationDocuments { get; set; }
    }
}