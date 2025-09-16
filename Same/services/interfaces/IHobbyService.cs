using Same.Models.DTOs.Responses;

namespace Same.Services.Interfaces
{
    public interface IHobbyService
    {
        Task<ApiResponse<List<HobbyResponse>>> GetAllHobbiesAsync();
        Task<ApiResponse<HobbyResponse>> GetHobbyByIdAsync(Guid hobbyId);
        Task<ApiResponse<List<HobbyResponse>>> GetHobbiesByTypeAsync(string type);
        Task<ApiResponse<List<HobbyResponse>>> SearchHobbiesAsync(string searchTerm);
        Task<ApiResponse<HobbyResponse>> CreateHobbyAsync(CreateHobbyRequest request);
        Task<ApiResponse<HobbyResponse>> UpdateHobbyAsync(Guid hobbyId, UpdateHobbyRequest request);
        Task<ApiResponse<bool>> DeleteHobbyAsync(Guid hobbyId);
        Task<ApiResponse<List<HobbyResponse>>> GetPopularHobbiesAsync(int count = 10);
        Task<ApiResponse<List<UserResponse>>> GetHobbyMembersAsync(Guid hobbyId);
        Task<ApiResponse<List<EventResponse>>> GetHobbyEventsAsync(Guid hobbyId);
    }

    public class CreateHobbyRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Sports, Arts, Music, Cooking, Gaming, Tech, Outdoor, Social, etc.
        public string? Description { get; set; }
        public string? IconUrl { get; set; }
    }

    public class UpdateHobbyRequest
    {
        public string? Name { get; set; }
        public string? Type { get; set; }
        public string? Description { get; set; }
        public string? IconUrl { get; set; }
        public bool? IsActive { get; set; }
    }
}