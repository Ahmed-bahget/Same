using Same.Models.Entities;

namespace Same.Services.Interfaces
{
    public interface INotificationService
    {
        Task<bool> SendNotificationAsync(Guid userId, string type, string title, string message, 
            Guid? relatedEntityId = null, string? relatedEntityType = null);
        Task<List<Notification>> GetUserNotificationsAsync(Guid userId, int page = 1, int pageSize = 20);
        Task<bool> MarkAsReadAsync(Guid notificationId, Guid userId);
        Task<bool> MarkAllAsReadAsync(Guid userId);
        Task<int> GetUnreadCountAsync(Guid userId);
    }
}
