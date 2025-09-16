using Microsoft.EntityFrameworkCore;
using Same.Data.Repositories.Interfaces;
using Same.Models.Entities;

namespace Same.Data.Repositories.Implementations
{
    public class HobbyRepository : Repository<Hobby>, IHobbyRepository
    {
        public HobbyRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Hobby>> GetByTypeAsync(string type) =>
            await _context.Hobbies.Where(h => h.Type == type && h.IsActive).ToListAsync();

        public async Task<IEnumerable<Hobby>> GetPopularHobbiesAsync(int take = 10) =>
            await _context.Hobbies.Where(h => h.IsActive).OrderByDescending(h => h.CommunitySize).Take(take).ToListAsync();

        public async Task<Hobby?> GetByNameAsync(string name) =>
            await _context.Hobbies.FirstOrDefaultAsync(h => h.Name == name && h.IsActive);

        public async Task<IEnumerable<Hobby>> SearchHobbiesAsync(string searchTerm) =>
            await _context.Hobbies.Where(h => h.IsActive && (h.Name.Contains(searchTerm) || h.Description!.Contains(searchTerm))).ToListAsync();

        public async Task UpdateCommunitySize(Guid hobbyId)
        {
            var hobby = await GetByIdAsync(hobbyId);
            if (hobby != null)
            {
                hobby.CommunitySize = await _context.UserHobbies.CountAsync(uh => uh.HobbyId == hobbyId);
                Update(hobby);
                await SaveChangesAsync();
            }
        }
    }
}