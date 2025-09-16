using Microsoft.EntityFrameworkCore;
using Same.Models.Entities;

namespace Same.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<UserConnection> UserConnections { get; set; }
        public DbSet<Hobby> Hobbies { get; set; }
        public DbSet<UserHobby> UserHobbies { get; set; }
        public DbSet<Place> Places { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventParticipant> EventParticipants { get; set; }
        public DbSet<EventComment> EventComments { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConversationParticipant> ConversationParticipants { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User Connections (Self-referencing many-to-many)
            modelBuilder.Entity<UserConnection>()
                .HasOne(uc => uc.RequesterUser)
                .WithMany(u => u.SentConnections)
                .HasForeignKey(uc => uc.RequesterUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserConnection>()
                .HasOne(uc => uc.ReceiverUser)
                .WithMany(u => u.ReceivedConnections)
                .HasForeignKey(uc => uc.ReceiverUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Orders (Multiple user relationships)
            modelBuilder.Entity<Order>()
                .HasOne(o => o.BuyerUser)
                .WithMany(u => u.BuyerOrders)
                .HasForeignKey(o => o.BuyerUserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.SellerUser)
                .WithMany(u => u.SellerOrders)
                .HasForeignKey(o => o.SellerUserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.DeliveryUser)
                .WithMany(u => u.DeliveryOrders)
                .HasForeignKey(o => o.DeliveryUserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.BrokerUser)
                .WithMany(u => u.BrokerOrders)
                .HasForeignKey(o => o.BrokerUserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Reviews (Multiple entity relationships)
            modelBuilder.Entity<Review>()
                .HasOne(r => r.ReviewerUser)
                .WithMany(u => u.WrittenReviews)
                .HasForeignKey(r => r.ReviewerUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.ReviewedUser)
                .WithMany(u => u.ReceivedReviews)
                .HasForeignKey(r => r.ReviewedUserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure decimal precision
            modelBuilder.Entity<User>()
                .Property(u => u.CurrentLatitude)
                .HasPrecision(10, 8);

            modelBuilder.Entity<User>()
                .Property(u => u.CurrentLongitude)
                .HasPrecision(11, 8);

            modelBuilder.Entity<Place>()
                .Property(p => p.Latitude)
                .HasPrecision(10, 8);

            modelBuilder.Entity<Place>()
                .Property(p => p.Longitude)
                .HasPrecision(11, 8);

            modelBuilder.Entity<Place>()
                .Property(p => p.Area)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Place>()
                .Property(p => p.RentPriceDaily)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Place>()
                .Property(p => p.RentPriceMonthly)
                .HasPrecision(12, 2);

            modelBuilder.Entity<Place>()
                .Property(p => p.SalePrice)
                .HasPrecision(15, 2);

            // ConversationParticipants (Multiple user relationships)
            modelBuilder.Entity<ConversationParticipant>()
                .HasOne(cp => cp.User)
                .WithMany(u => u.ConversationParticipations)
                .HasForeignKey(cp => cp.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ConversationParticipant>()
                .HasOne(cp => cp.Conversation)
                .WithMany(c => c.Participants)
                .HasForeignKey(cp => cp.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Messages
            modelBuilder.Entity<Message>()
                .HasOne(m => m.SenderUser)
                .WithMany(u => u.Messages)
                .HasForeignKey(m => m.SenderUserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Events
            modelBuilder.Entity<Event>()
                .HasOne(e => e.CreatorUser)
                .WithMany(u => u.CreatedEvents)
                .HasForeignKey(e => e.CreatorUserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<EventParticipant>()
                .HasOne(ep => ep.User)
                .WithMany(u => u.EventParticipations)
                .HasForeignKey(ep => ep.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Products
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Seller)
                .WithMany(u => u.Products)
                .HasForeignKey(p => p.SellerId)
                .OnDelete(DeleteBehavior.NoAction);

            // Places
            modelBuilder.Entity<Place>()
                .HasOne(p => p.Owner)
                .WithMany(u => u.OwnedPlaces)
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure indexes
            modelBuilder.Entity<User>()
                .HasIndex(u => new { u.CurrentLatitude, u.CurrentLongitude });

            modelBuilder.Entity<Place>()
                .HasIndex(p => new { p.Latitude, p.Longitude });

            modelBuilder.Entity<Event>()
                .HasIndex(e => new { e.Latitude, e.Longitude });
        }
    }
}
