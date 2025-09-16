using Same.Models.Entities;

namespace Same.Data.Repositories.Interfaces
{
    public interface IHobbyRepository : IRepository<Hobby>
    {
        Task<IEnumerable<Hobby>> GetByTypeAsync(string type);
        Task<IEnumerable<Hobby>> GetPopularHobbiesAsync(int take = 10);
        Task<Hobby?> GetByNameAsync(string name);
        Task<IEnumerable<Hobby>> SearchHobbiesAsync(string searchTerm);
        Task UpdateCommunitySize(Guid hobbyId);
    }
}