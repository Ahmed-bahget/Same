namespace Same.Models.DTOs.Responses
{
    public class UserRoleResponse
    {
        public string RoleType { get; set; } = string.Empty; // Delivery, Broker, Owner
        public bool IsActive { get; set; }
        public int ServiceRadius { get; set; } // in km
        public decimal HourlyRate { get; set; }
        public decimal CommissionRate { get; set; }
        public string VerificationStatus { get; set; } = string.Empty; // Pending, Verified, Rejected
        public bool IsAvailableNow { get; set; }
        public string? WorkingHours { get; set; }
    }
}