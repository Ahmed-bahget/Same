using Microsoft.EntityFrameworkCore;
using Same.Data;
using Same.Models.DTOs.Responses;
using Same.Models.Entities;
using Same.Services.Interfaces;

namespace Same.Services.Implementations
{
    public class HobbyService : IHobbyService
    {
        private readonly ApplicationDbContext _context;

        public HobbyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<List<HobbyResponse>>> GetAllHobbiesAsync()
        {
            try
            {
                var hobbies = await _context.Hobbies
                    .Where(h => h.IsActive)
                    .OrderBy(h => h.Name)
                    .ToListAsync();

                var responses = hobbies.Select(MapToHobbyResponse).ToList();
                return ApiResponse<List<HobbyResponse>>.SuccessResult(responses);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<HobbyResponse>>.ErrorResult($"Error retrieving hobbies: {ex.Message}");
            }
        }

        public async Task<ApiResponse<HobbyResponse>> GetHobbyByIdAsync(Guid hobbyId)
        {
            try
            {
                var hobby = await _context.Hobbies
                    .FirstOrDefaultAsync(h => h.HobbyId == hobbyId && h.IsActive);

                if (hobby == null)
                    return ApiResponse<HobbyResponse>.ErrorResult("Hobby not found");

                return ApiResponse<HobbyResponse>.SuccessResult(MapToHobbyResponse(hobby));
            }
            catch (Exception ex)
            {
                return ApiResponse<HobbyResponse>.ErrorResult($"Error retrieving hobby: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<HobbyResponse>>> GetHobbiesByTypeAsync(string type)
        {
            try
            {
                var hobbies = await _context.Hobbies
                    .Where(h => h.Type.ToLower() == type.ToLower() && h.IsActive)
                    .ToListAsync();

                var responses = hobbies.Select(MapToHobbyResponse).ToList();
                return ApiResponse<List<HobbyResponse>>.SuccessResult(responses);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<HobbyResponse>>.ErrorResult($"Error retrieving hobbies by type: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<HobbyResponse>>> SearchHobbiesAsync(string searchTerm)
        {
            try
            {
                var hobbies = await _context.Hobbies
                    .Where(h => h.IsActive && 
                        (h.Name.Contains(searchTerm) || 
                         (h.Description != null && h.Description.Contains(searchTerm))))
                    .ToListAsync();

                var responses = hobbies.Select(MapToHobbyResponse).ToList();
                return ApiResponse<List<HobbyResponse>>.SuccessResult(responses);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<HobbyResponse>>.ErrorResult($"Error searching hobbies: {ex.Message}");
            }
        }

        public async Task<ApiResponse<HobbyResponse>> CreateHobbyAsync(CreateHobbyRequest request)
        {
            try
            {
                var hobby = new Hobby
                {
                    Name = request.Name,
                    Type = request.Type,
                    Description = request.Description,
                    IconUrl = request.IconUrl,
                    CommunitySize = 0,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Hobbies.Add(hobby);
                await _context.SaveChangesAsync();

                return ApiResponse<HobbyResponse>.SuccessResult(MapToHobbyResponse(hobby), "Hobby created successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<HobbyResponse>.ErrorResult($"Error creating hobby: {ex.Message}");
            }
        }

        public async Task<ApiResponse<HobbyResponse>> UpdateHobbyAsync(Guid hobbyId, UpdateHobbyRequest request)
        {
            try
            {
                var hobby = await _context.Hobbies.FindAsync(hobbyId);
                if (hobby == null)
                    return ApiResponse<HobbyResponse>.ErrorResult("Hobby not found");

                if (!string.IsNullOrEmpty(request.Name))
                    hobby.Name = request.Name;
                if (!string.IsNullOrEmpty(request.Type))
                    hobby.Type = request.Type;
                if (request.Description != null)
                    hobby.Description = request.Description;
                if (request.IconUrl != null)
                    hobby.IconUrl = request.IconUrl;
                if (request.IsActive.HasValue)
                    hobby.IsActive = request.IsActive.Value;

                await _context.SaveChangesAsync();
                return ApiResponse<HobbyResponse>.SuccessResult(MapToHobbyResponse(hobby), "Hobby updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<HobbyResponse>.ErrorResult($"Error updating hobby: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteHobbyAsync(Guid hobbyId)
        {
            try
            {
                var hobby = await _context.Hobbies.FindAsync(hobbyId);
                if (hobby == null)
                    return ApiResponse<bool>.ErrorResult("Hobby not found");

                hobby.IsActive = false;
                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResult(true, "Hobby deleted successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Error deleting hobby: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<HobbyResponse>>> GetPopularHobbiesAsync(int count = 10)
        {
            try
            {
                var hobbies = await _context.Hobbies
                    .Where(h => h.IsActive)
                    .OrderByDescending(h => h.CommunitySize)
                    .Take(count)
                    .ToListAsync();

                var responses = hobbies.Select(MapToHobbyResponse).ToList();
                return ApiResponse<List<HobbyResponse>>.SuccessResult(responses);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<HobbyResponse>>.ErrorResult($"Error retrieving popular hobbies: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<UserResponse>>> GetHobbyMembersAsync(Guid hobbyId)
        {
            try
            {
                var users = await _context.UserHobbies
                    .Where(uh => uh.HobbyId == hobbyId)
                    .Include(uh => uh.User)
                    .Select(uh => uh.User!)
                    .Where(u => u.IsActive)
                    .ToListAsync();

                var responses = users.Select(u => new UserResponse
                {
                    UserId = u.UserId,
                    Username = u.Username,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    ProfileImageUrl = u.ProfileImageUrl,
                    JoinDate = u.JoinDate
                }).ToList();

                return ApiResponse<List<UserResponse>>.SuccessResult(responses);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<UserResponse>>.ErrorResult($"Error retrieving hobby members: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<EventResponse>>> GetHobbyEventsAsync(Guid hobbyId)
        {
            try
            {
                var events = await _context.Events
                    .Where(e => e.HobbyId == hobbyId && e.Status != "Cancelled")
                    .Include(e => e.CreatorUser)
                    .ToListAsync();

                var responses = events.Select(e => new EventResponse
                {
                    EventId = e.EventId,
                    Title = e.Title,
                    Description = e.Description ?? string.Empty,
                    CreatorUserId = e.CreatorUserId,
                    CreatorName = e.CreatorUser!.Username,
                    StartTime = e.StartDateTime,
                    EndTime = e.EndDateTime,
                    Location = e.CustomLocationName ?? "TBD",
                    MaxParticipants = e.MaxParticipants,
                    CurrentParticipants = e.CurrentParticipants,
                    Price = e.EntryFee,
                    Status = e.Status
                }).ToList();

                return ApiResponse<List<EventResponse>>.SuccessResult(responses);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<EventResponse>>.ErrorResult($"Error retrieving hobby events: {ex.Message}");
            }
        }

        private static HobbyResponse MapToHobbyResponse(Hobby hobby)
        {
            return new HobbyResponse
            {
                HobbyId = hobby.HobbyId,
                Name = hobby.Name,
                Type = hobby.Type,
                Description = hobby.Description,
                IconUrl = hobby.IconUrl,
                CommunitySize = hobby.CommunitySize,
                IsActive = hobby.IsActive
            };
        }
    }
}