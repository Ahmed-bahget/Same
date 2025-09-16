using Same.Models.DTOs.Requests.Chat;
using Same.Models.DTOs.Responses;

namespace Same.Services.Interfaces
{
    public interface IChatService
    {
        // Conversation Management
        Task<ApiResponse<ConversationResponse>> CreateConversationAsync(Guid creatorId, CreateConversationRequest request);
        Task<ApiResponse<List<ConversationResponse>>> GetUserConversationsAsync(Guid userId);
        Task<ApiResponse<ConversationResponse>> GetConversationByIdAsync(Guid conversationId, Guid userId);
        Task<ApiResponse<bool>> DeleteConversationAsync(Guid conversationId, Guid userId);
        Task<ApiResponse<bool>> LeaveConversationAsync(Guid conversationId, Guid userId);

        // Participant Management
        Task<ApiResponse<bool>> AddParticipantAsync(Guid conversationId, Guid userId, Guid participantId);
        Task<ApiResponse<bool>> RemoveParticipantAsync(Guid conversationId, Guid userId, Guid participantId);
        Task<ApiResponse<List<UserResponse>>> GetConversationParticipantsAsync(Guid conversationId, Guid userId);

        // Message Management
        Task<ApiResponse<bool>> SendMessageAsync(Guid conversationId, Guid senderId, SendMessageRequest request);
        Task<ApiResponse<List<MessageResponse>>> GetConversationMessagesAsync(Guid conversationId, Guid userId, int page = 1, int pageSize = 50);
        Task<ApiResponse<bool>> MarkMessagesAsReadAsync(Guid conversationId, Guid userId);
        Task<ApiResponse<bool>> DeleteMessageAsync(Guid messageId, Guid userId);
        Task<ApiResponse<bool>> EditMessageAsync(Guid messageId, Guid userId, string newContent);

        // Notifications & Status
        Task<ApiResponse<int>> GetUnreadMessageCountAsync(Guid userId);
        Task<ApiResponse<List<ConversationResponse>>> GetConversationsWithUnreadMessagesAsync(Guid userId);

        // Special Conversation Types
        Task<ApiResponse<ConversationResponse>> GetOrCreateOrderConversationAsync(Guid orderId, Guid userId);
        Task<ApiResponse<ConversationResponse>> GetOrCreateEventConversationAsync(Guid eventId, Guid userId);
        Task<ApiResponse<ConversationResponse>> GetOrCreateDirectMessageAsync(Guid userId1, Guid userId2);

    }
}
