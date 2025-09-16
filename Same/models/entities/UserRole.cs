using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
    [Table("UserRoles")]
    [Index(nameof(UserId), nameof(RoleType), IsUnique = true)]
    public class UserRole
    {
        [Key]
        public Guid UserRoleId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [StringLength(50)]
        public string RoleType { get; set; } = string.Empty; // Consumer, PlaceOwner, Broker, Delivery

        public bool IsActive { get; set; } = true;

        public int ServiceRadius { get; set; } = 5; // km

        [Column(TypeName = "decimal(10,2)")]
        public decimal HourlyRate { get; set; } = 0.00m;

        [Column(TypeName = "decimal(5,2)")]
        public decimal CommissionRate { get; set; } = 0.00m; // percentage

        public bool IsAvailableNow { get; set; } = true;

        [StringLength(1000)] // JSON format
        public string? WorkingHours { get; set; }

        [StringLength(20)]
        public string VerificationStatus { get; set; } = "Unverified"; // Unverified, Pending, Verified

        [StringLength(1000)] // JSON array
        public string? VerificationDocuments { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual User User { get; set; } = null!;
    }
}