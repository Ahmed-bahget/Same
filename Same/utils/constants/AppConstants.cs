namespace Same.Utils.Constants
{
    public static class AppConstants
    {
        // User Roles
        public static class UserRoles
        {
            public const string User = "User";
            public const string Seller = "Seller";
            public const string DeliveryPerson = "DeliveryPerson";
            public const string Broker = "Broker";
            public const string Admin = "Admin";
        }

        // Connection Types
        public static class ConnectionTypes
        {
            public const string Friend = "Friend";
            public const string Follow = "Follow";
            public const string Block = "Block";
        }

        // Connection Status
        public static class ConnectionStatus
        {
            public const string Pending = "Pending";
            public const string Accepted = "Accepted";
            public const string Rejected = "Rejected";
        }

        // Location Privacy
        public static class LocationPrivacy
        {
            public const string Public = "Public";
            public const string Friends = "Friends";
            public const string Private = "Private";
        }

        // Event Status
        public static class EventStatus
        {
            public const string Upcoming = "Upcoming";
            public const string Ongoing = "Ongoing";
            public const string Completed = "Completed";
            public const string Cancelled = "Cancelled";
        }

        // Order Status
        public static class OrderStatus
        {
            public const string Pending = "Pending";
            public const string Confirmed = "Confirmed";
            public const string InProgress = "InProgress";
            public const string Delivered = "Delivered";
            public const string Completed = "Completed";
            public const string Cancelled = "Cancelled";
        }

        // Message Types
        public static class MessageTypes
        {
            public const string Text = "Text";
            public const string Image = "Image";
            public const string File = "File";
            public const string Location = "Location";
        }

        // Conversation Types
        public static class ConversationTypes
        {
            public const string Private = "Private";
            public const string Group = "Group";
        }

        // Review Types
        public static class ReviewTypes
        {
            public const string User = "User";
            public const string Product = "Product";
            public const string Event = "Event";
            public const string Place = "Place";
        }

        // Hobby Types
        public static class HobbyTypes
        {
            public const string Sports = "Sports";
            public const string Arts = "Arts";
            public const string Music = "Music";
            public const string Cooking = "Cooking";
            public const string Gaming = "Gaming";
            public const string Tech = "Tech";
            public const string Outdoor = "Outdoor";
            public const string Social = "Social";
            public const string Reading = "Reading";
            public const string Travel = "Travel";
        }

        // Place Types
        public static class PlaceTypes
        {
            public const string Restaurant = "Restaurant";
            public const string Gym = "Gym";
            public const string Park = "Park";
            public const string Library = "Library";
            public const string Community = "Community";
            public const string Shop = "Shop";
            public const string Office = "Office";
            public const string Residence = "Residence";
            public const string Entertainment = "Entertainment";
            public const string Educational = "Educational";
        }

        // Skill Levels
        public static class SkillLevels
        {
            public const string Beginner = "Beginner";
            public const string Intermediate = "Intermediate";
            public const string Advanced = "Advanced";
            public const string Expert = "Expert";
        }

        // Payment Methods
        public static class PaymentMethods
        {
            public const string Cash = "Cash";
            public const string Card = "Card";
            public const string PayPal = "PayPal";
            public const string BankTransfer = "BankTransfer";
        }

        // Default Values
        public static class Defaults
        {
            public const int DefaultPageSize = 20;
            public const int MaxPageSize = 100;
            public const int DefaultRadius = 10; // km
            public const int MaxRadius = 100; // km
            public const int DefaultCacheMinutes = 15;
        }
    }
}