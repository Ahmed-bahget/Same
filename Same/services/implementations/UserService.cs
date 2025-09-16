using Microsoft.EntityFrameworkCore;
using Same.Data;
using Same.Models.DTOs.Requests.User;
using Same.Models.DTOs.Requests.Auth;
using Same.Models.DTOs.Responses;
using Same.Models.Entities;
using Same.Services.Interfaces;

namespace Same.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<UserResponse>> GetUserByIdAsync(Guid userId, Guid? currentUserId = null)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.UserHobbies)
                        .ThenInclude(uh => uh.Hobby)
                    .FirstOrDefaultAsync(u => u.UserId == userId && u.IsActive);

                if (user == null)
                {
                    return ApiResponse<UserResponse>.ErrorResult("User not found");
                }

                var userResponse = new UserResponse
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    FullName = user.FullName,
                    ProfileImageUrl = user.ProfileImageUrl,
                    Bio = user.Bio,
                    IsActive = user.IsActive,
                    IsVerified = user.IsVerified,
                    JoinDate = user.JoinDate,
                    Hobbies = user.UserHobbies?.Select(uh => new HobbyResponse
                    {
                        HobbyId = uh.Hobby.HobbyId,
                        Name = uh.Hobby.Name,
                        Type = uh.Hobby.Type,
                        Description = uh.Hobby.Description
                    }).ToList() ?? new List<HobbyResponse>()
                };

                return ApiResponse<UserResponse>.SuccessResult(userResponse);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserResponse>.ErrorResult($"Error retrieving user: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserResponse>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return ApiResponse<UserResponse>.ErrorResult("User not found");
                }

                if (!string.IsNullOrEmpty(request.FirstName))
                    user.FirstName = request.FirstName;
                if (!string.IsNullOrEmpty(request.LastName))
                    user.LastName = request.LastName;
                if (request.Bio != null)
                    user.Bio = request.Bio;
                if (!string.IsNullOrEmpty(request.PhoneNumber))
                    user.PhoneNumber = request.PhoneNumber;
                if (request.DateOfBirth.HasValue)
                    user.DateOfBirth = request.DateOfBirth;
                if (!string.IsNullOrEmpty(request.ProfileImageUrl))
                    user.ProfileImageUrl = request.ProfileImageUrl;

                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return await GetUserByIdAsync(userId);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserResponse>.ErrorResult($"Error updating profile: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> AddUserHobbyAsync(Guid userId, Guid hobbyId, string skillLevel = "Beginner", int yearsExperience = 0)
        {
            try
            {
                var existingUserHobby = await _context.UserHobbies
                    .FirstOrDefaultAsync(uh => uh.UserId == userId && uh.HobbyId == hobbyId);

                if (existingUserHobby != null)
                {
                    return ApiResponse<bool>.ErrorResult("User already has this hobby");
                }

                var userHobby = new UserHobby
                {
                    UserId = userId,
                    HobbyId = hobbyId,
                    SkillLevel = skillLevel,
                    YearsExperience = yearsExperience,
                    CreatedAt = DateTime.UtcNow
                };

                _context.UserHobbies.Add(userHobby);
                await _context.SaveChangesAsync();
                
                return ApiResponse<bool>.SuccessResult(true, "Hobby added successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Error adding hobby: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> RemoveUserHobbyAsync(Guid userId, Guid hobbyId)
        {
            try
            {
                var userHobby = await _context.UserHobbies
                    .FirstOrDefaultAsync(uh => uh.UserId == userId && uh.HobbyId == hobbyId);

                if (userHobby == null)
                {
                    return ApiResponse<bool>.ErrorResult("User hobby not found");
                }

                _context.UserHobbies.Remove(userHobby);
                await _context.SaveChangesAsync();
                
                return ApiResponse<bool>.SuccessResult(true, "Hobby removed successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Error removing hobby: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<UserHobbyResponse>>> GetUserHobbiesAsync(Guid userId)
        {
            try
            {
                var userHobbies = await _context.UserHobbies
                    .Where(uh => uh.UserId == userId)
                    .Include(uh => uh.Hobby)
                    .ToListAsync();

                var responses = userHobbies.Select(uh => new UserHobbyResponse
                {
                    HobbyId = uh.HobbyId,
                    Name = uh.Hobby.Name,
                    Type = uh.Hobby.Type,
                    SkillLevel = uh.SkillLevel,
                    YearsExperience = uh.YearsExperience,
                    PersonalDescription = uh.PersonalDescription
                }).ToList();

                return ApiResponse<List<UserHobbyResponse>>.SuccessResult(responses);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<UserHobbyResponse>>.ErrorResult($"Error retrieving user hobbies: {ex.Message}");
            }
        }

        // Additional methods for expanded interface
        public async Task<ApiResponse<UserResponse>> GetUserByUsernameAsync(string username, Guid? currentUserId = null)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.UserHobbies)
                        .ThenInclude(uh => uh.Hobby)
                    .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower() && u.IsActive);

                if (user == null)
                    return ApiResponse<UserResponse>.ErrorResult("User not found");

                return await GetUserByIdAsync(user.UserId, currentUserId);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserResponse>.ErrorResult($"Error retrieving user: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<UserResponse>>> SearchUsersAsync(SearchUsersRequest request, Guid? currentUserId = null)
        {
            try
            {
                var query = _context.Users.AsQueryable().Where(u => u.IsActive);

                if (!string.IsNullOrEmpty(request.Query))
                {
                    query = query.Where(u => u.Username.Contains(request.Query) ||
                                           (u.FirstName != null && u.FirstName.Contains(request.Query)) ||
                                           (u.LastName != null && u.LastName.Contains(request.Query)));
                }

                var users = await query.Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
                var responses = new List<UserResponse>();
                foreach (var user in users)
                {
                    var response = await GetUserByIdAsync(user.UserId, currentUserId);
                    if (response.Success) responses.Add(response.Data!);
                }

                return ApiResponse<List<UserResponse>>.SuccessResult(responses);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<UserResponse>>.ErrorResult($"Error searching users: {ex.Message}");
            }
        }

        // Social Features - stub implementations
        public async Task<ApiResponse<bool>> SendFriendRequestAsync(Guid userId, AddFriendRequest request)
        {
            await Task.CompletedTask;
            return ApiResponse<bool>.ErrorResult("Friend requests not yet implemented");
        }

        public async Task<ApiResponse<bool>> RespondToFriendRequestAsync(Guid userId, Guid connectionId, bool accept)
        {
            await Task.CompletedTask;
            return ApiResponse<bool>.ErrorResult("Friend requests not yet implemented");
        }

        public async Task<ApiResponse<bool>> RemoveFriendAsync(Guid userId, Guid friendId)
        {
            await Task.CompletedTask;
            return ApiResponse<bool>.ErrorResult("Friend management not yet implemented");
        }

        public async Task<ApiResponse<List<ConnectionResponse>>> GetConnectionsAsync(Guid userId, string connectionType = "Friend")
        {
            await Task.CompletedTask;
            return ApiResponse<List<ConnectionResponse>>.ErrorResult("Connections not yet implemented");
        }

        public async Task<ApiResponse<List<ConnectionResponse>>> GetPendingRequestsAsync(Guid userId)
        {
            await Task.CompletedTask;
            return ApiResponse<List<ConnectionResponse>>.ErrorResult("Pending requests not yet implemented");
        }

        public async Task<ApiResponse<List<UserResponse>>> GetMutualFriendsAsync(Guid userId, Guid targetUserId)
        {
            await Task.CompletedTask;
            return ApiResponse<List<UserResponse>>.ErrorResult("Mutual friends not yet implemented");
        }

        public async Task<ApiResponse<List<UserResponse>>> GetFriendSuggestionsAsync(Guid userId)
        {
            await Task.CompletedTask;
            return ApiResponse<List<UserResponse>>.ErrorResult("Friend suggestions not yet implemented");
        }

        public async Task<ApiResponse<bool>> BlockUserAsync(Guid userId, Guid targetUserId)
        {
            await Task.CompletedTask;
            return ApiResponse<bool>.ErrorResult("Block user not yet implemented");
        }

        // Location Features - stub implementations
        public async Task<ApiResponse<bool>> UpdateLocationAsync(Guid userId, UpdateLocationRequest request)
        {
            await Task.CompletedTask;
            return ApiResponse<bool>.ErrorResult("Location updates not yet implemented");
        }

        public async Task<ApiResponse<List<UserResponse>>> GetNearbyUsersAsync(Guid userId, int radiusKm = 10)
        {
            await Task.CompletedTask;
            return ApiResponse<List<UserResponse>>.ErrorResult("Nearby users not yet implemented");
        }

        // Role Management - stub implementations
        public async Task<ApiResponse<bool>> UpdateRoleAsync(Guid userId, UpdateRoleRequest request)
        {
            await Task.CompletedTask;
            return ApiResponse<bool>.ErrorResult("Role updates not yet implemented");
        }

        public async Task<ApiResponse<List<UserRoleResponse>>> GetUserRolesAsync(Guid userId)
        {
            await Task.CompletedTask;
            return ApiResponse<List<UserRoleResponse>>.ErrorResult("User roles not yet implemented");
        }

        public async Task<ApiResponse<bool>> ToggleRoleStatusAsync(Guid userId, string roleType, bool isActive)
        {
            await Task.CompletedTask;
            return ApiResponse<bool>.ErrorResult("Role toggle not yet implemented");
        }

        // Statistics & Analytics - stub implementations
        public async Task<ApiResponse<object>> GetUserStatsAsync(Guid userId)
        {
            await Task.CompletedTask;
            return ApiResponse<object>.ErrorResult("User stats not yet implemented");
        }

        public async Task<ApiResponse<List<UserResponse>>> GetUsersByHobbyAsync(Guid hobbyId, Guid currentUserId)
        {
            try
            {
                var users = await _context.UserHobbies
                    .Where(uh => uh.HobbyId == hobbyId && uh.UserId != currentUserId)
                    .Include(uh => uh.User)
                    .Select(uh => uh.User!)
                    .Where(u => u.IsActive)
                    .Take(20)
                    .ToListAsync();

                var responses = new List<UserResponse>();
                foreach (var user in users)
                {
                    var response = await GetUserByIdAsync(user.UserId, currentUserId);
                    if (response.Success) responses.Add(response.Data!);
                }

                return ApiResponse<List<UserResponse>>.SuccessResult(responses);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<UserResponse>>.ErrorResult($"Error retrieving users by hobby: {ex.Message}");
            }
        }
    }
}
