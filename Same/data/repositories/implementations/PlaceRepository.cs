using Microsoft.EntityFrameworkCore;
using Same.Data.Repositories.Interfaces;
using Same.Models.Entities;

namespace Same.Data.Repositories.Implementations
{
    public class PlaceRepository : Repository<Place>, IPlaceRepository
    {
        public PlaceRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Place>> GetByLocationAsync(decimal latitude, decimal longitude, int radiusKm)
        {
            var latDelta = (decimal)(radiusKm * 0.009);
            var lngDelta = (decimal)(radiusKm * 0.009);

            return await _context.Places
                .Where(p => p.Latitude >= latitude - latDelta &&
                           p.Latitude <= latitude + latDelta &&
                           p.Longitude >= longitude - lngDelta &&
                           p.Longitude <= longitude + lngDelta &&
                           p.IsActive)
                .Include(p => p.Owner)
                .OrderBy(p => Math.Abs(p.Latitude - latitude) + Math.Abs(p.Longitude - longitude))
                .ToListAsync();
        }

        public async Task<IEnumerable<Place>> GetByTypeAsync(string placeType)
        {
            return await _context.Places
                .Where(p => p.PlaceType == placeType && p.IsActive)
                .Include(p => p.Owner)
                .ToListAsync();
        }

        public async Task<IEnumerable<Place>> GetByOwnerAsync(Guid ownerId)
        {
            return await _context.Places
                .Where(p => p.OwnerId == ownerId)
                .Include(p => p.Owner)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Place>> GetForSaleAsync(decimal? minPrice = null, decimal? maxPrice = null)
        {
            var query = _context.Places
                .Where(p => p.IsForSale && p.IsActive);

            if (minPrice.HasValue)
                query = query.Where(p => p.SalePrice >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.SalePrice <= maxPrice.Value);

            return await query
                .Include(p => p.Owner)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Place>> GetForRentAsync(decimal? minPrice = null, decimal? maxPrice = null)
        {
            var query = _context.Places
                .Where(p => p.IsForRent && p.IsActive);

            if (minPrice.HasValue)
                query = query.Where(p => p.RentPriceMonthly >= minPrice.Value || p.RentPriceDaily >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.RentPriceMonthly <= maxPrice.Value || p.RentPriceDaily <= maxPrice.Value);

            return await query
                .Include(p => p.Owner)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Place>> SearchPlacesAsync(string searchTerm, int skip = 0, int take = 20)
        {
            return await _context.Places
                .Where(p => p.IsActive &&
                           (p.Name.Contains(searchTerm) ||
                            p.Description!.Contains(searchTerm) ||
                            p.Address.Contains(searchTerm) ||
                            p.Category!.Contains(searchTerm)))
                .Include(p => p.Owner)
                .OrderByDescending(p => p.ViewCount)
                .ThenByDescending(p => p.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<IEnumerable<Place>> GetPopularPlacesAsync(int take = 10)
        {
            return await _context.Places
                .Where(p => p.IsActive)
                .Include(p => p.Owner)
                .OrderByDescending(p => p.ViewCount)
                .ThenByDescending(p => p.FavoriteCount)
                .Take(take)
                .ToListAsync();
        }

        public async Task IncrementViewCountAsync(Guid placeId)
        {
            var place = await GetByIdAsync(placeId);
            if (place != null)
            {
                place.ViewCount++;
                place.UpdatedAt = DateTime.UtcNow;
                Update(place);
                await SaveChangesAsync();
            }
        }
    }
}