using Same.Data;
using Same.Models.Entities;
using Same.Services.Interfaces;
using Same.Utils.Helpers;
using Microsoft.EntityFrameworkCore;


namespace Same.Services.Implementations
{
        public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;

        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> SendNotificationAsync(Guid userId, string type, string title, string message, 
            Guid? relatedEntityId = null, string? relatedEntityType = null)
        {
            try
            {
                var notification = new Notification
                {
                    UserId = userId,
                    NotificationType = type,
                    Title = title,
                    Message = message,
                    RelatedEntityId = relatedEntityId,
                    RelatedEntityType = relatedEntityType
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();

                // Here you would also send real-time notification via SignalR
                // await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveNotification", notification);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<Notification>> GetUserNotificationsAsync(Guid userId, int page = 1, int pageSize = 20)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<bool> MarkAsReadAsync(Guid notificationId, Guid userId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationId == notificationId && n.UserId == userId);

            if (notification == null) return false;

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarkAllAsReadAsync(Guid userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetUnreadCountAsync(Guid userId)
        {
            return await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);
        }
    }
}
