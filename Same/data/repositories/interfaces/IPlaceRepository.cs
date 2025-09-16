using Same.Models.Entities;

namespace Same.Data.Repositories.Interfaces
{
    public interface IPlaceRepository : IRepository<Place>
    {
        Task<IEnumerable<Place>> GetByLocationAsync(decimal latitude, decimal longitude, int radiusKm);
        Task<IEnumerable<Place>> GetByTypeAsync(string placeType);
        Task<IEnumerable<Place>> GetByOwnerAsync(Guid ownerId);
        Task<IEnumerable<Place>> GetForSaleAsync(decimal? minPrice = null, decimal? maxPrice = null);
        Task<IEnumerable<Place>> GetForRentAsync(decimal? minPrice = null, decimal? maxPrice = null);
        Task<IEnumerable<Place>> SearchPlacesAsync(string searchTerm, int skip = 0, int take = 20);
        Task<IEnumerable<Place>> GetPopularPlacesAsync(int take = 10);
        Task IncrementViewCountAsync(Guid placeId);
    }
}