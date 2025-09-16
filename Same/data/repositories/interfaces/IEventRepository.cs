using Same.Models.Entities;

namespace Same.Data.Repositories.Interfaces
{
    public interface IEventRepository : IRepository<Event>
    {
        Task<IEnumerable<Event>> GetByHobbyAsync(Guid hobbyId);
        Task<IEnumerable<Event>> GetByLocationAsync(decimal latitude, decimal longitude, int radiusKm);
        Task<IEnumerable<Event>> GetByCreatorAsync(Guid creatorId);
        Task<IEnumerable<Event>> GetUpcomingEventsAsync(int skip = 0, int take = 20);
        Task<IEnumerable<Event>> GetUserParticipatingEventsAsync(Guid userId);
        Task<IEnumerable<Event>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<Event?> GetWithParticipantsAsync(Guid eventId);
        Task IncrementViewCountAsync(Guid eventId);
    }
}