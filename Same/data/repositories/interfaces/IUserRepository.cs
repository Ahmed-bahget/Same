using Same.Models.Entities;

namespace Same.Data.Repositories.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByUsernameOrEmailAsync(string usernameOrEmail);
        Task<IEnumerable<User>> GetByLocationAsync(decimal latitude, decimal longitude, int radiusKm);
        Task<IEnumerable<User>> GetUsersByHobbyAsync(Guid hobbyId);
        Task<IEnumerable<User>> SearchUsersAsync(string searchTerm, int skip = 0, int take = 20);
        Task<bool> IsUsernameAvailableAsync(string username, Guid? excludeUserId = null);
        Task<bool> IsEmailAvailableAsync(string email, Guid? excludeUserId = null);
        Task UpdateLocationAsync(Guid userId, decimal latitude, decimal longitude, string? address);
        Task<IEnumerable<User>> GetFriendsAsync(Guid userId);
        Task<IEnumerable<User>> GetMutualFriendsAsync(Guid userId1, Guid userId2);
    }
}