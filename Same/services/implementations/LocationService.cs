using Same.Data;
using Same.Services.Interfaces;
using Same.Utils.Helpers;
using Same.Data.Repositories.Interfaces;

namespace Same.Services.Implementations
{
    public class LocationService : ILocationService
    {
        private readonly IUserRepository _userRepository;
        public LocationService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<(decimal lat, decimal lng)?> GeocodeAddressAsync(string address)
        {
            // Implementation would use a service like Google Maps Geocoding API
            // For now, return null - implement later
            await Task.CompletedTask;
            return null;
        }

        public async Task<string?> ReverseGeocodeAsync(decimal latitude, decimal longitude)
        {
            // Implementation would use a service like Google Maps Reverse Geocoding API
            await Task.CompletedTask;
            return null;
        }

        public double CalculateDistance(decimal lat1, decimal lng1, decimal lat2, decimal lng2)
        {
            return LocationHelper.CalculateDistance((double)lat1, (double)lng1, (double)lat2, (double)lng2);
        }

        public async Task<List<T>> FilterByDistanceAsync<T>(List<T> items, decimal centerLat, decimal centerLng, 
            double maxDistanceKm, Func<T, (decimal lat, decimal lng)> getCoordinates)
        {
            await Task.CompletedTask;
            var result = new List<T>();

            foreach (var item in items)
            {
                var coords = getCoordinates(item);
                var distance = CalculateDistance(centerLat, centerLng, coords.lat, coords.lng);
                if (distance <= maxDistanceKm)
                {
                    result.Add(item);
                }
            }

            return result;
        }

        public async Task UpdateUserLocationAsync(Guid userId, decimal latitude, decimal longitude, string? address)
        {
            await _userRepository.UpdateLocationAsync(userId, latitude, longitude, address);
            await _userRepository.SaveChangesAsync();
        }
    }
}
