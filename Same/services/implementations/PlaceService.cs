using Same.Data;
using Same.Models.DTOs.Responses;
using Same.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Same.Services.Implementations
{
    public class PlaceService : IPlaceService
    {
        private readonly ApplicationDbContext _context;

        public PlaceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<ApiResponse<PlaceResponse>> CreatePlaceAsync(Guid ownerId, CreatePlaceRequest request)
        {
            return Task.FromResult(ApiResponse<PlaceResponse>.ErrorResult("Place service not fully implemented yet"));
        }

        public Task<ApiResponse<PlaceResponse>> GetPlaceByIdAsync(Guid placeId)
        {
            return Task.FromResult(ApiResponse<PlaceResponse>.ErrorResult("Place service not fully implemented yet"));
        }

        public Task<ApiResponse<List<PlaceResponse>>> GetPlacesByOwnerAsync(Guid ownerId)
        {
            return Task.FromResult(ApiResponse<List<PlaceResponse>>.ErrorResult("Place service not fully implemented yet"));
        }

        public async Task<ApiResponse<List<PlaceResponse>>> SearchPlacesAsync(SearchPlacesRequest request)
        {
            try
            {
                var query = _context.Places
                    .Include(p => p.Owner)
                    .Where(p => p.IsActive);

                // Apply filters
                if (!string.IsNullOrEmpty(request.Name))
                {
                    query = query.Where(p => p.Name.Contains(request.Name));
                }

                if (request.IsForSale.HasValue && request.IsForSale.Value)
                {
                    query = query.Where(p => p.IsForSale == true);
                }

                if (request.IsForRent.HasValue && request.IsForRent.Value)
                {
                    query = query.Where(p => p.IsForRent == true);
                }

                // Fix: Use SalePrice instead of Price for sale filtering
                if (request.MinPrice.HasValue)
                {
                    query = query.Where(p => p.SalePrice >= request.MinPrice.Value || p.RentPriceMonthly >= request.MinPrice.Value);
                }

                if (request.MaxPrice.HasValue)
                {
                    query = query.Where(p => p.SalePrice <= request.MaxPrice.Value || p.RentPriceMonthly <= request.MaxPrice.Value);
                }

                // Apply pagination
                var places = await query
                    .OrderByDescending(p => p.CreatedAt)
                    .Skip((request.Page - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync();

                var placeResponses = places.Select(p => new PlaceResponse
                {
                    PlaceId = p.PlaceId,
                    Name = p.Name,
                    Description = p.Description ?? string.Empty,
                    Category = p.Category ?? string.Empty,
                    Address = p.Address,
                    Latitude = (double)p.Latitude, // Fix: Cast decimal to double
                    Longitude = (double)p.Longitude, // Fix: Cast decimal to double
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                }).ToList();

                return ApiResponse<List<PlaceResponse>>.SuccessResult(placeResponses);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<PlaceResponse>>.ErrorResult($"Failed to search places: {ex.Message}");
            }
        }

        public Task<ApiResponse<PlaceResponse>> UpdatePlaceAsync(Guid placeId, Guid ownerId, UpdatePlaceRequest request)
        {
            return Task.FromResult(ApiResponse<PlaceResponse>.ErrorResult("Place service not fully implemented yet"));
        }

        public Task<ApiResponse<bool>> DeletePlaceAsync(Guid placeId, Guid ownerId)
        {
            return Task.FromResult(ApiResponse<bool>.ErrorResult("Place service not fully implemented yet"));
        }

        public Task<ApiResponse<List<PlaceResponse>>> GetNearbyPlacesAsync(decimal latitude, decimal longitude, double radiusKm = 10)
        {
            return Task.FromResult(ApiResponse<List<PlaceResponse>>.ErrorResult("Place service not fully implemented yet"));
        }

        public async Task<ApiResponse<List<PlaceResponse>>> GetPlacesByTypeAsync(string placeType)
        {
            try
            {
                var places = await _context.Places
                    .Include(p => p.Owner)
                    .Where(p => p.IsActive && p.PlaceType == placeType) // Fix: Use PlaceType instead of Type
                    .OrderByDescending(p => p.CreatedAt)
                    .Take(20)
                    .ToListAsync();

                var placeResponses = places.Select(p => new PlaceResponse
                {
                    PlaceId = p.PlaceId,
                    Name = p.Name,
                    Description = p.Description ?? string.Empty,
                    Category = p.Category ?? string.Empty,
                    Address = p.Address,
                    Latitude = (double)p.Latitude, // Fix: Cast decimal to double
                    Longitude = (double)p.Longitude, // Fix: Cast decimal to double
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                }).ToList();

                return ApiResponse<List<PlaceResponse>>.SuccessResult(placeResponses);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<PlaceResponse>>.ErrorResult($"Failed to get places by type: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<PlaceResponse>>> GetPopularPlacesAsync(int count = 10)
        {
            try
            {
                var places = await _context.Places
                    .Include(p => p.Owner)
                    .Where(p => p.IsActive)
                    .OrderByDescending(p => p.FavoriteCount) // Fix: Use FavoriteCount instead of ReviewCount
                    .ThenByDescending(p => p.ViewCount) // Additional ordering by ViewCount
                    .ThenByDescending(p => p.CreatedAt)
                    .Take(count)
                    .ToListAsync();

                var placeResponses = places.Select(p => new PlaceResponse
                {
                    PlaceId = p.PlaceId,
                    Name = p.Name,
                    Description = p.Description ?? string.Empty,
                    Category = p.Category ?? string.Empty,
                    Address = p.Address,
                    Latitude = (double)p.Latitude, // Fix: Cast decimal to double
                    Longitude = (double)p.Longitude, // Fix: Cast decimal to double
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                }).ToList();

                return ApiResponse<List<PlaceResponse>>.SuccessResult(placeResponses);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<PlaceResponse>>.ErrorResult($"Failed to get popular places: {ex.Message}");
            }
        }

        public Task<ApiResponse<List<ProductResponse>>> GetPlaceProductsAsync(Guid placeId)
        {
            return Task.FromResult(ApiResponse<List<ProductResponse>>.ErrorResult("Place service not fully implemented yet"));
        }

        public Task<ApiResponse<List<EventResponse>>> GetPlaceEventsAsync(Guid placeId)
        {
            return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Place service not fully implemented yet"));
        }

        public Task<ApiResponse<List<ReviewResponse>>> GetPlaceReviewsAsync(Guid placeId)
        {
            return Task.FromResult(ApiResponse<List<ReviewResponse>>.ErrorResult("Place service not fully implemented yet"));
        }

        public Task<ApiResponse<bool>> ToggleFavoriteAsync(Guid userId, Guid placeId)
        {
            return Task.FromResult(ApiResponse<bool>.ErrorResult("Place service not fully implemented yet"));
        }

        public Task<ApiResponse<List<PlaceResponse>>> GetUserFavoritePlacesAsync(Guid userId)
        {
            return Task.FromResult(ApiResponse<List<PlaceResponse>>.ErrorResult("Place service not fully implemented yet"));
        }

        public Task<ApiResponse<List<PlaceResponse>>> GetPlacesForSaleAsync(SearchPlacesRequest request)
        {
            return Task.FromResult(ApiResponse<List<PlaceResponse>>.ErrorResult("Place service not fully implemented yet"));
        }

        public Task<ApiResponse<List<PlaceResponse>>> GetPlacesForRentAsync(SearchPlacesRequest request)
        {
            return Task.FromResult(ApiResponse<List<PlaceResponse>>.ErrorResult("Place service not fully implemented yet"));
        }

        public Task<ApiResponse<bool>> UpdateAvailabilityAsync(Guid placeId, Guid ownerId, string status)
        {
            return Task.FromResult(ApiResponse<bool>.ErrorResult("Place service not fully implemented yet"));
        }
    }
}















// using Same.Data;
// using Same.Models.DTOs.Responses;
// using Same.Services.Interfaces;
// using Microsoft.EntityFrameworkCore;

// namespace Same.Services.Implementations
// {
//     public class PlaceService : IPlaceService
//     {
//         private readonly ApplicationDbContext _context;

//         public PlaceService(ApplicationDbContext context)
//         {
//             _context = context;
//         }

//         public Task<ApiResponse<PlaceResponse>> CreatePlaceAsync(Guid ownerId, CreatePlaceRequest request)
//         {
//             return Task.FromResult(ApiResponse<PlaceResponse>.ErrorResult("Place service not fully implemented yet"));
//         }

//         public Task<ApiResponse<PlaceResponse>> GetPlaceByIdAsync(Guid placeId)
//         {
//             return Task.FromResult(ApiResponse<PlaceResponse>.ErrorResult("Place service not fully implemented yet"));
//         }

//         public Task<ApiResponse<List<PlaceResponse>>> GetPlacesByOwnerAsync(Guid ownerId)
//         {
//             return Task.FromResult(ApiResponse<List<PlaceResponse>>.ErrorResult("Place service not fully implemented yet"));
//         }

//         public async Task<ApiResponse<List<PlaceResponse>>> SearchPlacesAsync(SearchPlacesRequest request)
//         {
//             try
//             {
//                 var query = _context.Places
//                     .Include(p => p.Owner)
//                     .Where(p => p.IsActive);

//                 // Apply filters
//                 if (!string.IsNullOrEmpty(request.Name))
//                 {
//                     query = query.Where(p => p.Name.Contains(request.Name));
//                 }

//                 if (request.IsForSale.HasValue && request.IsForSale.Value)
//                 {
//                     query = query.Where(p => p.IsForSale == true);
//                 }

//                 if (request.IsForRent.HasValue && request.IsForRent.Value)
//                 {
//                     query = query.Where(p => p.IsForRent == true);
//                 }

//                 if (request.MinPrice.HasValue)
//                 {
//                     query = query.Where(p => p.Price >= request.MinPrice.Value);
//                 }

//                 if (request.MaxPrice.HasValue)
//                 {
//                     query = query.Where(p => p.Price <= request.MaxPrice.Value);
//                 }

//                 // Apply pagination
//                 var places = await query
//                     .OrderByDescending(p => p.CreatedAt)
//                     .Skip((request.Page - 1) * request.PageSize)
//                     .Take(request.PageSize)
//                     .ToListAsync();

//                 var placeResponses = places.Select(p => new PlaceResponse
//                 {
//                     PlaceId = p.PlaceId,
//                     Name = p.Name,
//                     Description = p.Description,
//                     Category = p.Category,
//                     Address = p.Address,
//                     Latitude = p.Latitude,
//                     Longitude = p.Longitude,
//                     CreatedAt = p.CreatedAt,
//                     UpdatedAt = p.UpdatedAt
//                 }).ToList();

//                 return ApiResponse<List<PlaceResponse>>.SuccessResult(placeResponses);
//             }
//             catch (Exception ex)
//             {
//                 return ApiResponse<List<PlaceResponse>>.ErrorResult($"Failed to search places: {ex.Message}");
//             }
//         }

//         public Task<ApiResponse<PlaceResponse>> UpdatePlaceAsync(Guid placeId, Guid ownerId, UpdatePlaceRequest request)
//         {
//             return Task.FromResult(ApiResponse<PlaceResponse>.ErrorResult("Place service not fully implemented yet"));
//         }

//         public Task<ApiResponse<bool>> DeletePlaceAsync(Guid placeId, Guid ownerId)
//         {
//             return Task.FromResult(ApiResponse<bool>.ErrorResult("Place service not fully implemented yet"));
//         }

//         public Task<ApiResponse<List<PlaceResponse>>> GetNearbyPlacesAsync(decimal latitude, decimal longitude, double radiusKm = 10)
//         {
//             return Task.FromResult(ApiResponse<List<PlaceResponse>>.ErrorResult("Place service not fully implemented yet"));
//         }

//         public async Task<ApiResponse<List<PlaceResponse>>> GetPlacesByTypeAsync(string placeType)
//         {
//             try
//             {
//                 var places = await _context.Places
//                     .Include(p => p.Owner)
//                     .Where(p => p.IsActive && p.Type == placeType)
//                     .OrderByDescending(p => p.CreatedAt)
//                     .Take(20)
//                     .ToListAsync();

//                 var placeResponses = places.Select(p => new PlaceResponse
//                 {
//                     PlaceId = p.PlaceId,
//                     Name = p.Name,
//                     Description = p.Description,
//                     Category = p.Category,
//                     Address = p.Address,
//                     Latitude = p.Latitude,
//                     Longitude = p.Longitude,
//                     CreatedAt = p.CreatedAt,
//                     UpdatedAt = p.UpdatedAt
//                 }).ToList();

//                 return ApiResponse<List<PlaceResponse>>.SuccessResult(placeResponses);
//             }
//             catch (Exception ex)
//             {
//                 return ApiResponse<List<PlaceResponse>>.ErrorResult($"Failed to get places by type: {ex.Message}");
//             }
//         }

//         public async Task<ApiResponse<List<PlaceResponse>>> GetPopularPlacesAsync(int count = 10)
//         {
//             try
//             {
//                 var places = await _context.Places
//                     .Include(p => p.Owner)
//                     .Where(p => p.IsActive)
//                     .OrderByDescending(p => p.ReviewCount)
//                     .ThenByDescending(p => p.CreatedAt)
//                     .Take(count)
//                     .ToListAsync();

//                 var placeResponses = places.Select(p => new PlaceResponse
//                 {
//                     PlaceId = p.PlaceId,
//                     Name = p.Name,
//                     Description = p.Description,
//                     Category = p.Category,
//                     Address = p.Address,
//                     Latitude = p.Latitude,
//                     Longitude = p.Longitude,
//                     CreatedAt = p.CreatedAt,
//                     UpdatedAt = p.UpdatedAt
//                 }).ToList();

//                 return ApiResponse<List<PlaceResponse>>.SuccessResult(placeResponses);
//             }
//             catch (Exception ex)
//             {
//                 return ApiResponse<List<PlaceResponse>>.ErrorResult($"Failed to get popular places: {ex.Message}");
//             }
//         }

//         public Task<ApiResponse<List<ProductResponse>>> GetPlaceProductsAsync(Guid placeId)
//         {
//             return Task.FromResult(ApiResponse<List<ProductResponse>>.ErrorResult("Place service not fully implemented yet"));
//         }

//         public Task<ApiResponse<List<EventResponse>>> GetPlaceEventsAsync(Guid placeId)
//         {
//             return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Place service not fully implemented yet"));
//         }

//         public Task<ApiResponse<List<ReviewResponse>>> GetPlaceReviewsAsync(Guid placeId)
//         {
//             return Task.FromResult(ApiResponse<List<ReviewResponse>>.ErrorResult("Place service not fully implemented yet"));
//         }

//         public Task<ApiResponse<bool>> ToggleFavoriteAsync(Guid userId, Guid placeId)
//         {
//             return Task.FromResult(ApiResponse<bool>.ErrorResult("Place service not fully implemented yet"));
//         }

//         public Task<ApiResponse<List<PlaceResponse>>> GetUserFavoritePlacesAsync(Guid userId)
//         {
//             return Task.FromResult(ApiResponse<List<PlaceResponse>>.ErrorResult("Place service not fully implemented yet"));
//         }

//         public Task<ApiResponse<List<PlaceResponse>>> GetPlacesForSaleAsync(SearchPlacesRequest request)
//         {
//             return Task.FromResult(ApiResponse<List<PlaceResponse>>.ErrorResult("Place service not fully implemented yet"));
//         }

//         public Task<ApiResponse<List<PlaceResponse>>> GetPlacesForRentAsync(SearchPlacesRequest request)
//         {
//             return Task.FromResult(ApiResponse<List<PlaceResponse>>.ErrorResult("Place service not fully implemented yet"));
//         }

//         public Task<ApiResponse<bool>> UpdateAvailabilityAsync(Guid placeId, Guid ownerId, string status)
//         {
//             return Task.FromResult(ApiResponse<bool>.ErrorResult("Place service not fully implemented yet"));
//         }
//     }
// }