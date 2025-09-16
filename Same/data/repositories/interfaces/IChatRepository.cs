using Same.Models.Entities;

namespace Same.Data.Repositories.Interfaces
{
    public interface IChatRepository : IRepository<Conversation>
    {
        Task<IEnumerable<Conversation>> GetUserConversationsAsync(Guid userId);
        Task<Conversation?> GetConversationBetweenUsersAsync(Guid userId1, Guid userId2);
        Task<IEnumerable<Message>> GetConversationMessagesAsync(Guid conversationId, int skip = 0, int take = 50);
        Task<Message?> GetLastMessageAsync(Guid conversationId);
        Task<int> GetUnreadMessageCountAsync(Guid conversationId, Guid userId);
        Task MarkMessagesAsReadAsync(Guid conversationId, Guid userId);
    }
}