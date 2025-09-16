using Same.Services.Interfaces;
using System.Security.Claims;

namespace Same.Middleware
{
    public class LocationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<LocationMiddleware> _logger;

        public LocationMiddleware(RequestDelegate next, ILogger<LocationMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, ILocationService locationService)
        {
            // Check if user is authenticated and location headers are present
            if (context.User.Identity!.IsAuthenticated && 
                context.Request.Headers.TryGetValue("X-User-Latitude", out var latHeader) &&
                context.Request.Headers.TryGetValue("X-User-Longitude", out var lngHeader))
            {
                try
                {
                    var userId = Guid.Parse(context.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                    
                    if (decimal.TryParse(latHeader.ToString(), out var latitude) &&
                        decimal.TryParse(lngHeader.ToString(), out var longitude))
                    {
                        var address = context.Request.Headers.TryGetValue("X-User-Address", out var addressHeader) 
                            ? addressHeader.ToString() 
                            : null;

                        // Update user location in background
                        _ = Task.Run(async () =>
                        {
                            try
                            {
                                await locationService.UpdateUserLocationAsync(userId, latitude, longitude, address);
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(ex, "Failed to update user location for user {UserId}", userId);
                            }
                        });
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to parse location data from headers");
                }
            }

            await _next(context);
        }
    }
}