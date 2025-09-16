using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace Same.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        public async Task JoinConversation(string conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
        }

        public async Task LeaveConversation(string conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
        }

        public async Task SendMessage(string conversationId, string message)
        {
            await Clients.Group($"conversation_{conversationId}")
                .SendAsync("ReceiveMessage", Context.UserIdentifier, message);
        }
    }
}