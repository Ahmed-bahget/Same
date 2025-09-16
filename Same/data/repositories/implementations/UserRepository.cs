using Microsoft.EntityFrameworkCore;
using Same.Data.Repositories.Interfaces;
using Same.Models.Entities;

namespace Same.Data.Repositories.Implementations
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByUsernameOrEmailAsync(string usernameOrEmail)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Username == usernameOrEmail || u.Email == usernameOrEmail);
        }

        public async Task<IEnumerable<User>> GetByLocationAsync(decimal latitude, decimal longitude, int radiusKm)
        {
            // Simple distance calculation (for more precision, use PostGIS or similar)
            var latDelta = (decimal)(radiusKm * 0.009); // Rough approximation
            var lngDelta = (decimal)(radiusKm * 0.009);

            return await _context.Users
                .Where(u => u.CurrentLatitude.HasValue && u.CurrentLongitude.HasValue &&
                           u.CurrentLatitude >= latitude - latDelta &&
                           u.CurrentLatitude <= latitude + latDelta &&
                           u.CurrentLongitude >= longitude - lngDelta &&
                           u.CurrentLongitude <= longitude + lngDelta &&
                           u.IsActive)
                .OrderBy(u => Math.Abs((u.CurrentLatitude ?? 0) - latitude) + Math.Abs((u.CurrentLongitude ?? 0) - longitude))
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetUsersByHobbyAsync(Guid hobbyId)
        {
            return await _context.Users
                .Where(u => u.UserHobbies.Any(uh => uh.HobbyId == hobbyId) && u.IsActive)
                .Include(u => u.UserHobbies)
                .ThenInclude(uh => uh.Hobby)
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> SearchUsersAsync(string searchTerm, int skip = 0, int take = 20)
        {
            var query = _context.Users
                .Where(u => u.IsActive &&
                           (u.Username.Contains(searchTerm) ||
                            u.FirstName!.Contains(searchTerm) ||
                            u.LastName!.Contains(searchTerm) ||
                            u.Bio!.Contains(searchTerm)))
                .OrderBy(u => u.Username)
                .Skip(skip)
                .Take(take);

            return await query.ToListAsync();
        }

        public async Task<bool> IsUsernameAvailableAsync(string username, Guid? excludeUserId = null)
        {
            var query = _context.Users.Where(u => u.Username == username);
            
            if (excludeUserId.HasValue)
                query = query.Where(u => u.UserId != excludeUserId.Value);

            return !await query.AnyAsync();
        }

        public async Task<bool> IsEmailAvailableAsync(string email, Guid? excludeUserId = null)
        {
            var query = _context.Users.Where(u => u.Email == email);
            
            if (excludeUserId.HasValue)
                query = query.Where(u => u.UserId != excludeUserId.Value);

            return !await query.AnyAsync();
        }

        public async Task UpdateLocationAsync(Guid userId, decimal latitude, decimal longitude, string? address)
        {
            var user = await GetByIdAsync(userId);
            if (user != null)
            {
                user.CurrentLatitude = latitude;
                user.CurrentLongitude = longitude;
                user.LocationAddress = address;
                user.LocationUpdatedAt = DateTime.UtcNow;
                user.UpdatedAt = DateTime.UtcNow;
                Update(user);
            }
        }

        public async Task<IEnumerable<User>> GetFriendsAsync(Guid userId)
        {
            var friendIds = await _context.UserConnections
                .Where(uc => (uc.RequesterUserId == userId || uc.ReceiverUserId == userId) && 
                            uc.Status == "Accepted")
                .Select(uc => uc.RequesterUserId == userId ? uc.ReceiverUserId : uc.RequesterUserId)
                .ToListAsync();

            return await _context.Users
                .Where(u => friendIds.Contains(u.UserId) && u.IsActive)
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetMutualFriendsAsync(Guid userId1, Guid userId2)
        {
            var user1Friends = await GetFriendsAsync(userId1);
            var user2Friends = await GetFriendsAsync(userId2);
            
            var user1FriendIds = user1Friends.Select(u => u.UserId).ToHashSet();
            
            return user2Friends.Where(u => user1FriendIds.Contains(u.UserId));
        }
    }
}