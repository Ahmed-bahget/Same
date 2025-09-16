using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Same.Services.Interfaces;
using Same.Models.DTOs.Requests.Auth;
using Same.Models.DTOs.Requests.User;
using Same.Models.DTOs.Responses;

namespace Same.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Register a new user account
        /// </summary>
        [HttpPost("register")]
        [ProducesResponseType(typeof(ApiResponse<AuthResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<AuthResponse>), 400)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<AuthResponse>.ErrorResult("Invalid data", ModelState));

            var result = await _authService.RegisterAsync(request);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Login with email/username and password
        /// </summary>
        [HttpPost("login")]
        [ProducesResponseType(typeof(ApiResponse<AuthResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<AuthResponse>), 401)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<AuthResponse>.ErrorResult("Invalid data", ModelState));

            var result = await _authService.LoginAsync(request);
            
            if (!result.Success)
                return Unauthorized(result);

            return Ok(result);
        }

        /// <summary>
        /// Refresh JWT token
        /// </summary>
        [HttpPost("refresh")]
        [ProducesResponseType(typeof(ApiResponse<string>), 200)]
        public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
        {
            var result = await _authService.RefreshTokenAsync(refreshToken);
            return Ok(result);
        }

        /// <summary>
        /// Logout current user
        /// </summary>
        [HttpPost("logout")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> Logout()
        {
            var userId = GetCurrentUserId();
            var result = await _authService.LogoutAsync(userId);
            return Ok(result);
        }

        /// <summary>
        /// Verify email address
        /// </summary>
        [HttpGet("verify-email")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            var result = await _authService.VerifyEmailAsync(token);
            return Ok(result);
        }

        /// <summary>
        /// Request password reset
        /// </summary>
        [HttpPost("forgot-password")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            var result = await _authService.ForgotPasswordAsync(email);
            return Ok(result);
        }

        /// <summary>
        /// Reset password with token
        /// </summary>
        [HttpPost("reset-password")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> ResetPassword([FromQuery] string token, [FromBody] string newPassword)
        {
            var result = await _authService.ResetPasswordAsync(token, newPassword);
            return Ok(result);
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Get current user profile
        /// </summary>
        [HttpGet("profile")]
        [ProducesResponseType(typeof(ApiResponse<UserResponse>), 200)]
        public async Task<IActionResult> GetCurrentUserProfile()
        {
            var userId = GetCurrentUserId();
            var result = await _userService.GetUserByIdAsync(userId);
            return Ok(result);
        }

        /// <summary>
        /// Get user profile by ID
        /// </summary>
        [HttpGet("{userId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<UserResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<UserResponse>), 404)]
        public async Task<IActionResult> GetUserById(Guid userId)
        {
            var currentUserId = GetCurrentUserId();
            var result = await _userService.GetUserByIdAsync(userId, currentUserId);
            
            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        /// <summary>
        /// Get user profile by username
        /// </summary>
        [HttpGet("username/{username}")]
        [ProducesResponseType(typeof(ApiResponse<UserResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<UserResponse>), 404)]
        public async Task<IActionResult> GetUserByUsername(string username)
        {
            var currentUserId = GetCurrentUserId();
            var result = await _userService.GetUserByUsernameAsync(username, currentUserId);
            
            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        /// <summary>
        /// Update current user profile
        /// </summary>
        [HttpPut("profile")]
        [ProducesResponseType(typeof(ApiResponse<UserResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<UserResponse>), 400)]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserResponse>.ErrorResult("Invalid data", ModelState));

            var userId = GetCurrentUserId();
            var result = await _userService.UpdateProfileAsync(userId, request);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Search users with filters
        /// </summary>
        [HttpPost("search")]
        [ProducesResponseType(typeof(ApiResponse<List<UserResponse>>), 200)]
        public async Task<IActionResult> SearchUsers([FromBody] SearchUsersRequest request)
        {
            var currentUserId = GetCurrentUserId();
            var result = await _userService.SearchUsersAsync(request, currentUserId);
            return Ok(result);
        }

        /// <summary>
        /// Send friend/follow request
        /// </summary>
        [HttpPost("connect")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(typeof(ApiResponse<bool>), 400)]
        public async Task<IActionResult> SendFriendRequest([FromBody] AddFriendRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<bool>.ErrorResult("Invalid data", ModelState));

            var userId = GetCurrentUserId();
            var result = await _userService.SendFriendRequestAsync(userId, request);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Respond to friend request
        /// </summary>
        [HttpPost("connect/{connectionId:guid}/respond")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> RespondToFriendRequest(Guid connectionId, [FromBody] bool accept)
        {
            var userId = GetCurrentUserId();
            var result = await _userService.RespondToFriendRequestAsync(userId, connectionId, accept);
            return Ok(result);
        }

        /// <summary>
        /// Get user connections (friends/followers)
        /// </summary>
        [HttpGet("connections")]
        [ProducesResponseType(typeof(ApiResponse<List<ConnectionResponse>>), 200)]
        public async Task<IActionResult> GetConnections([FromQuery] string type = "Friend")
        {
            var userId = GetCurrentUserId();
            var result = await _userService.GetConnectionsAsync(userId, type);
            return Ok(result);
        }

        /// <summary>
        /// Get pending connection requests
        /// </summary>
        [HttpGet("connections/pending")]
        [ProducesResponseType(typeof(ApiResponse<List<ConnectionResponse>>), 200)]
        public async Task<IActionResult> GetPendingRequests()
        {
            var userId = GetCurrentUserId();
            var result = await _userService.GetPendingRequestsAsync(userId);
            return Ok(result);
        }

        /// <summary>
        /// Remove friend/unfollow
        /// </summary>
        [HttpDelete("connections/{friendId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> RemoveFriend(Guid friendId)
        {
            var userId = GetCurrentUserId();
            var result = await _userService.RemoveFriendAsync(userId, friendId);
            return Ok(result);
        }

        /// <summary>
        /// Block user
        /// </summary>
        [HttpPost("block/{targetUserId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> BlockUser(Guid targetUserId)
        {
            var userId = GetCurrentUserId();
            var result = await _userService.BlockUserAsync(userId, targetUserId);
            return Ok(result);
        }

        /// <summary>
        /// Update user location
        /// </summary>
        [HttpPut("location")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> UpdateLocation([FromBody] UpdateLocationRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<bool>.ErrorResult("Invalid data", ModelState));

            var userId = GetCurrentUserId();
            var result = await _userService.UpdateLocationAsync(userId, request);
            return Ok(result);
        }

        /// <summary>
        /// Get nearby users
        /// </summary>
        [HttpGet("nearby")]
        [ProducesResponseType(typeof(ApiResponse<List<UserResponse>>), 200)]
        public async Task<IActionResult> GetNearbyUsers([FromQuery] int radiusKm = 10)
        {
            var userId = GetCurrentUserId();
            var result = await _userService.GetNearbyUsersAsync(userId, radiusKm);
            return Ok(result);
        }

        /// <summary>
        /// Update user role
        /// </summary>
        [HttpPost("roles")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<bool>.ErrorResult("Invalid data", ModelState));

            var userId = GetCurrentUserId();
            var result = await _userService.UpdateRoleAsync(userId, request);
            return Ok(result);
        }

        /// <summary>
        /// Get user roles
        /// </summary>
        [HttpGet("roles")]
        [ProducesResponseType(typeof(ApiResponse<List<UserRoleResponse>>), 200)]
        public async Task<IActionResult> GetUserRoles()
        {
            var userId = GetCurrentUserId();
            var result = await _userService.GetUserRolesAsync(userId);
            return Ok(result);
        }

        /// <summary>
        /// Toggle role active status
        /// </summary>
        [HttpPatch("roles/{roleType}/toggle")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> ToggleRoleStatus(string roleType, [FromBody] bool isActive)
        {
            var userId = GetCurrentUserId();
            var result = await _userService.ToggleRoleStatusAsync(userId, roleType, isActive);
            return Ok(result);
        }

        /// <summary>
        /// Get user statistics
        /// </summary>
        [HttpGet("stats")]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        public async Task<IActionResult> GetUserStats()
        {
            var userId = GetCurrentUserId();
            var result = await _userService.GetUserStatsAsync(userId);
            return Ok(result);
        }

        /// <summary>
        /// Get mutual friends with another user
        /// </summary>
        [HttpGet("{targetUserId:guid}/mutual-friends")]
        [ProducesResponseType(typeof(ApiResponse<List<UserResponse>>), 200)]
        public async Task<IActionResult> GetMutualFriends(Guid targetUserId)
        {
            var userId = GetCurrentUserId();
            var result = await _userService.GetMutualFriendsAsync(userId, targetUserId);
            return Ok(result);
        }

        /// <summary>
        /// Get friend suggestions
        /// </summary>
        [HttpGet("suggestions")]
        [ProducesResponseType(typeof(ApiResponse<List<UserResponse>>), 200)]
        public async Task<IActionResult> GetFriendSuggestions()
        {
            var userId = GetCurrentUserId();
            var result = await _userService.GetFriendSuggestionsAsync(userId);
            return Ok(result);
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }
    }
}