using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Same.Services.Interfaces;
using Same.Models.DTOs.Requests.Chat;
using Same.Models.DTOs.Responses;

namespace Same.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        /// <summary>
        /// Get user's conversations
        /// </summary>
        [HttpGet("conversations")]
        [ProducesResponseType(typeof(ApiResponse<List<ConversationResponse>>), 200)]
        public async Task<IActionResult> GetConversations()
        {
            var userId = GetCurrentUserId();
            var result = await _chatService.GetUserConversationsAsync(userId);
            return Ok(result);
        }

        /// <summary>
        /// Get conversation messages
        /// </summary>
        [HttpGet("conversations/{conversationId:guid}/messages")]
        [ProducesResponseType(typeof(ApiResponse<List<object>>), 200)]
        public async Task<IActionResult> GetConversationMessages(Guid conversationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var userId = GetCurrentUserId();
            var result = await _chatService.GetConversationMessagesAsync(conversationId, userId, page, pageSize);
            return Ok(result);
        }

        /// <summary>
        /// Send a message
        /// </summary>
        [HttpPost("conversations/{conversationId:guid}/messages")]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        public async Task<IActionResult> SendMessage(Guid conversationId, [FromBody] SendMessageRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.ErrorResult("Invalid data", ModelState));

            var userId = GetCurrentUserId();
            var result = await _chatService.SendMessageAsync(conversationId, userId, request);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Start conversation with a user
        /// </summary>
        [HttpPost("conversations/start/{targetUserId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<ConversationResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<ConversationResponse>), 400)]
        public async Task<IActionResult> StartConversation(Guid targetUserId)
        {
            var userId = GetCurrentUserId();
            var result = await _chatService.GetOrCreateDirectMessageAsync(userId, targetUserId);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Mark messages as read
        /// </summary>
        [HttpPost("conversations/{conversationId:guid}/mark-read")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> MarkMessagesAsRead(Guid conversationId)
        {
            var userId = GetCurrentUserId();
            var result = await _chatService.MarkMessagesAsReadAsync(conversationId, userId);
            return Ok(result);
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }
    }
}