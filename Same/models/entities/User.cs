using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;


namespace Same.Models.Entities
{
    // User Entity
    [Table("Users")]
    [Index(nameof(Username), IsUnique = true)]
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(CurrentLatitude), nameof(CurrentLongitude))]
    public class User
    {
        [Key]
        public Guid UserId { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [StringLength(50)]
        public string? FirstName { get; set; }

        [StringLength(50)]
        public string? LastName { get; set; }

        [StringLength(500)]
        public string? ProfileImageUrl { get; set; }

        [StringLength(500)]
        public string? CoverImageUrl { get; set; }

        [StringLength(1000)]
        public string? Bio { get; set; }

        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [Column(TypeName = "decimal(10, 8)")]
        public decimal? CurrentLatitude { get; set; }

        [Column(TypeName = "decimal(11, 8)")]
        public decimal? CurrentLongitude { get; set; }

        [StringLength(500)]
        public string? LocationAddress { get; set; }

        [StringLength(20)]
        public string LocationPrivacy { get; set; } = "Friends"; // Public, Friends, Private

        public DateTime? LocationUpdatedAt { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsVerified { get; set; } = false;
        public DateTime JoinDate { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public virtual ICollection<UserConnection> SentConnections { get; set; } = new List<UserConnection>();
        public virtual ICollection<UserConnection> ReceivedConnections { get; set; } = new List<UserConnection>();
        public virtual ICollection<UserHobby> UserHobbies { get; set; } = new List<UserHobby>();
        public virtual ICollection<Place> OwnedPlaces { get; set; } = new List<Place>();
        public virtual ICollection<Event> CreatedEvents { get; set; } = new List<Event>();
        public virtual ICollection<EventParticipant> EventParticipations { get; set; } = new List<EventParticipant>();
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
        public virtual ICollection<Order> BuyerOrders { get; set; } = new List<Order>();
        public virtual ICollection<Order> SellerOrders { get; set; } = new List<Order>();
        public virtual ICollection<Order> DeliveryOrders { get; set; } = new List<Order>();
        public virtual ICollection<Order> BrokerOrders { get; set; } = new List<Order>();
        public virtual ICollection<Review> WrittenReviews { get; set; } = new List<Review>();
        public virtual ICollection<Review> ReceivedReviews { get; set; } = new List<Review>();
        public virtual ICollection<Conversation> CreatedConversations { get; set; } = new List<Conversation>();
        public virtual ICollection<ConversationParticipant> ConversationParticipations { get; set; } = new List<ConversationParticipant>();
        public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

        // Helper Properties
        [NotMapped]
        public string FullName => $"{FirstName} {LastName}".Trim();

        [NotMapped]
        public int Age => DateOfBirth.HasValue ? 
            DateTime.Now.Year - DateOfBirth.Value.Year - 
            (DateTime.Now.DayOfYear < DateOfBirth.Value.DayOfYear ? 1 : 0) : 0;
    }
}