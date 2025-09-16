using Same.Models.Entities;

namespace Same.Services.Interfaces
{
    public interface ILocationService
    {
        Task<(decimal lat, decimal lng)?> GeocodeAddressAsync(string address);
        Task<string?> ReverseGeocodeAsync(decimal latitude, decimal longitude);
        double CalculateDistance(decimal lat1, decimal lng1, decimal lat2, decimal lng2);
        Task<List<T>> FilterByDistanceAsync<T>(List<T> items, decimal centerLat, decimal centerLng, 
            double maxDistanceKm, Func<T, (decimal lat, decimal lng)> getCoordinates);
        
        // Additional methods needed by middleware
        Task UpdateUserLocationAsync(Guid userId, decimal latitude, decimal longitude, string? address);
    }


}
