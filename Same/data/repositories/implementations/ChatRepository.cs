using Microsoft.EntityFrameworkCore;
using Same.Data.Repositories.Interfaces;
using Same.Models.Entities;

namespace Same.Data.Repositories.Implementations
{
    public class ChatRepository : Repository<Conversation>, IChatRepository
    {
        public ChatRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Conversation>> GetUserConversationsAsync(Guid userId) =>
            await _context.Conversations
                .Where(c => c.Participants.Any(p => p.UserId == userId))
                .Include(c => c.Participants).ThenInclude(p => p.User)
                .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
                .OrderByDescending(c => c.UpdatedAt).ToListAsync();

        public async Task<Conversation?> GetConversationBetweenUsersAsync(Guid userId1, Guid userId2) =>
            await _context.Conversations
                .Where(c => c.ConversationType == "Private" &&
                           c.Participants.Any(p => p.UserId == userId1) &&
                           c.Participants.Any(p => p.UserId == userId2))
                .Include(c => c.Participants).ThenInclude(p => p.User)
                .FirstOrDefaultAsync();

        public async Task<IEnumerable<Message>> GetConversationMessagesAsync(Guid conversationId, int skip = 0, int take = 50) =>
            await _context.Messages
                .Where(m => m.ConversationId == conversationId)
                .Include(m => m.SenderUser)
                .OrderByDescending(m => m.SentAt)
                .Skip(skip).Take(take)
                .OrderBy(m => m.SentAt).ToListAsync();

        public async Task<Message?> GetLastMessageAsync(Guid conversationId) =>
            await _context.Messages
                .Where(m => m.ConversationId == conversationId)
                .Include(m => m.SenderUser)
                .OrderByDescending(m => m.SentAt)
                .FirstOrDefaultAsync();

        public async Task<int> GetUnreadMessageCountAsync(Guid conversationId, Guid userId) =>
            await _context.Messages
                .Where(m => m.ConversationId == conversationId && 
                           m.SenderUserId != userId && 
                           !m.IsRead)
                .CountAsync();

        public async Task MarkMessagesAsReadAsync(Guid conversationId, Guid userId)
        {
            var unreadMessages = await _context.Messages
                .Where(m => m.ConversationId == conversationId && 
                           m.SenderUserId != userId && 
                           !m.IsRead)
                .ToListAsync();

            foreach (var message in unreadMessages)
            {
                message.IsRead = true;
                message.ReadAt = DateTime.UtcNow;
            }

            if (unreadMessages.Any())
                await SaveChangesAsync();
        }
    }
}