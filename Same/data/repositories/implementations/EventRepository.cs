using Microsoft.EntityFrameworkCore;
using Same.Data.Repositories.Interfaces;
using Same.Models.Entities;

namespace Same.Data.Repositories.Implementations
{
    public class EventRepository : Repository<Event>, IEventRepository
    {
        public EventRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Event>> GetByHobbyAsync(Guid hobbyId) =>
            await _context.Events.Where(e => e.HobbyId == hobbyId && e.Status == "Upcoming")
                .Include(e => e.CreatorUser).Include(e => e.Hobby).Include(e => e.Place)
                .OrderBy(e => e.StartDateTime).ToListAsync();

        public async Task<IEnumerable<Event>> GetByLocationAsync(decimal latitude, decimal longitude, int radiusKm)
        {
            var latDelta = (decimal)(radiusKm * 0.009);
            var lngDelta = (decimal)(radiusKm * 0.009);

            return await _context.Events
                .Where(e => e.Latitude.HasValue && e.Longitude.HasValue &&
                           e.Latitude >= latitude - latDelta && e.Latitude <= latitude + latDelta &&
                           e.Longitude >= longitude - lngDelta && e.Longitude <= longitude + lngDelta &&
                           e.Status == "Upcoming" && e.IsPublic)
                .Include(e => e.CreatorUser).Include(e => e.Hobby)
                .OrderBy(e => e.StartDateTime).ToListAsync();
        }

        public async Task<IEnumerable<Event>> GetByCreatorAsync(Guid creatorId) =>
            await _context.Events.Where(e => e.CreatorUserId == creatorId)
                .Include(e => e.Hobby).Include(e => e.Place)
                .OrderByDescending(e => e.CreatedAt).ToListAsync();

        public async Task<IEnumerable<Event>> GetUpcomingEventsAsync(int skip = 0, int take = 20) =>
            await _context.Events.Where(e => e.Status == "Upcoming" && e.IsPublic && e.StartDateTime > DateTime.UtcNow)
                .Include(e => e.CreatorUser).Include(e => e.Hobby)
                .OrderBy(e => e.StartDateTime).Skip(skip).Take(take).ToListAsync();

        public async Task<IEnumerable<Event>> GetUserParticipatingEventsAsync(Guid userId) =>
            await _context.Events.Where(e => e.Participants.Any(p => p.UserId == userId))
                .Include(e => e.CreatorUser).Include(e => e.Hobby)
                .OrderBy(e => e.StartDateTime).ToListAsync();

        public async Task<IEnumerable<Event>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate) =>
            await _context.Events.Where(e => e.StartDateTime >= startDate && e.StartDateTime <= endDate && e.IsPublic)
                .Include(e => e.CreatorUser).Include(e => e.Hobby)
                .OrderBy(e => e.StartDateTime).ToListAsync();

        public async Task<Event?> GetWithParticipantsAsync(Guid eventId) =>
            await _context.Events.Include(e => e.Participants).ThenInclude(p => p.User)
                .Include(e => e.CreatorUser).Include(e => e.Hobby)
                .FirstOrDefaultAsync(e => e.EventId == eventId);

        public async Task IncrementViewCountAsync(Guid eventId)
        {
            var eventEntity = await GetByIdAsync(eventId);
            if (eventEntity != null)
            {
                eventEntity.ViewCount++;
                eventEntity.UpdatedAt = DateTime.UtcNow;
                Update(eventEntity);
                await SaveChangesAsync();
            }
        }
    }
}