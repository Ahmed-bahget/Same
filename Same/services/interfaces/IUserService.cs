using Same.Models.DTOs.Requests.User;
using Same.Models.DTOs.Requests.Auth;
using Same.Models.DTOs.Responses;

namespace Same.Services.Interfaces
{
    public interface IUserService
    {
        // Profile Management
        Task<ApiResponse<UserResponse>> GetUserByIdAsync(Guid userId, Guid? currentUserId = null);
        Task<ApiResponse<UserResponse>> GetUserByUsernameAsync(string username, Guid? currentUserId = null);
        Task<ApiResponse<List<UserResponse>>> SearchUsersAsync(SearchUsersRequest request, Guid? currentUserId = null);
        Task<ApiResponse<UserResponse>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);

        // Social Features - Friends & Connections
        Task<ApiResponse<bool>> SendFriendRequestAsync(Guid userId, AddFriendRequest request);
        Task<ApiResponse<bool>> RespondToFriendRequestAsync(Guid userId, Guid connectionId, bool accept);
        Task<ApiResponse<bool>> RemoveFriendAsync(Guid userId, Guid friendId);
        Task<ApiResponse<List<ConnectionResponse>>> GetConnectionsAsync(Guid userId, string connectionType = "Friend");
        Task<ApiResponse<List<ConnectionResponse>>> GetPendingRequestsAsync(Guid userId);
        Task<ApiResponse<List<UserResponse>>> GetMutualFriendsAsync(Guid userId, Guid targetUserId);
        Task<ApiResponse<List<UserResponse>>> GetFriendSuggestionsAsync(Guid userId);
        Task<ApiResponse<bool>> BlockUserAsync(Guid userId, Guid targetUserId);

        // Location Features
        Task<ApiResponse<bool>> UpdateLocationAsync(Guid userId, UpdateLocationRequest request);
        Task<ApiResponse<List<UserResponse>>> GetNearbyUsersAsync(Guid userId, int radiusKm = 10);

        // Role Management
        Task<ApiResponse<bool>> UpdateRoleAsync(Guid userId, UpdateRoleRequest request);
        Task<ApiResponse<List<UserRoleResponse>>> GetUserRolesAsync(Guid userId);
        Task<ApiResponse<bool>> ToggleRoleStatusAsync(Guid userId, string roleType, bool isActive);

        // Statistics & Analytics
        Task<ApiResponse<object>> GetUserStatsAsync(Guid userId);

        // Hobbies Management
        Task<ApiResponse<bool>> AddUserHobbyAsync(Guid userId, Guid hobbyId, string skillLevel = "Beginner", int yearsExperience = 0);
        Task<ApiResponse<bool>> RemoveUserHobbyAsync(Guid userId, Guid hobbyId);
        Task<ApiResponse<List<UserHobbyResponse>>> GetUserHobbiesAsync(Guid userId);
        Task<ApiResponse<List<UserResponse>>> GetUsersByHobbyAsync(Guid hobbyId, Guid currentUserId);
    }
}
