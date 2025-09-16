using Microsoft.EntityFrameworkCore;
using Same.Data;
using Same.Models.DTOs.Responses;
using Same.Services.Interfaces;

namespace Same.Services.Implementations
{
    public class EventService : IEventService
    {
        private readonly ApplicationDbContext _context;

        public EventService(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<ApiResponse<EventResponse>> CreateEventAsync(Guid creatorId, CreateEventRequest request)
        {
            return Task.FromResult(ApiResponse<EventResponse>.ErrorResult("Event service not fully implemented yet"));
        }

        public Task<ApiResponse<EventResponse>> GetEventByIdAsync(Guid eventId, Guid? currentUserId = null)
        {
            return Task.FromResult(ApiResponse<EventResponse>.ErrorResult("Event service not fully implemented yet"));
        }

        public Task<ApiResponse<List<EventResponse>>> GetEventsByCreatorAsync(Guid creatorId)
        {
            return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Event service not fully implemented yet"));
        }

        public Task<ApiResponse<List<EventResponse>>> SearchEventsAsync(SearchEventsRequest request, Guid? currentUserId = null)
        {
            return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Event service not fully implemented yet"));
        }

        public Task<ApiResponse<EventResponse>> UpdateEventAsync(Guid eventId, Guid creatorId, UpdateEventRequest request)
        {
            return Task.FromResult(ApiResponse<EventResponse>.ErrorResult("Event service not fully implemented yet"));
        }

        public Task<ApiResponse<bool>> DeleteEventAsync(Guid eventId, Guid creatorId)
        {
            return Task.FromResult(ApiResponse<bool>.ErrorResult("Event service not fully implemented yet"));
        }

        public Task<ApiResponse<bool>> JoinEventAsync(Guid eventId, Guid userId)
        {
            return Task.FromResult(ApiResponse<bool>.ErrorResult("Event service not fully implemented yet"));
        }

        public Task<ApiResponse<bool>> LeaveEventAsync(Guid eventId, Guid userId)
        {
            return Task.FromResult(ApiResponse<bool>.ErrorResult("Event service not fully implemented yet"));
        }

        public Task<ApiResponse<List<UserResponse>>> GetEventParticipantsAsync(Guid eventId)
        {
            return Task.FromResult(ApiResponse<List<UserResponse>>.ErrorResult("Event service not fully implemented yet"));
        }

        public Task<ApiResponse<List<EventResponse>>> GetUserEventsAsync(Guid userId)
        {
            return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Event service not fully implemented yet"));
        }

        public Task<ApiResponse<bool>> InviteToEventAsync(Guid eventId, Guid creatorId, List<Guid> userIds)
        {
            return Task.FromResult(ApiResponse<bool>.ErrorResult("Event service not fully implemented yet"));
        }

        public Task<ApiResponse<List<EventResponse>>> GetNearbyEventsAsync(decimal latitude, decimal longitude, double radiusKm = 10, Guid? currentUserId = null)
        {
            return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Event service not fully implemented yet"));
        }

        public Task<ApiResponse<List<EventResponse>>> GetEventsByHobbyAsync(Guid hobbyId, Guid? currentUserId = null)
        {
            return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Event service not fully implemented yet"));
        }

        public Task<ApiResponse<List<EventResponse>>> GetEventsByPlaceAsync(Guid placeId, Guid? currentUserId = null)
        {
            return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Event service not fully implemented yet"));
        }

        public async Task<ApiResponse<List<EventResponse>>> GetUpcomingEventsAsync(Guid userId, int days = 7)
        {
            try
            {
                var startDate = DateTime.UtcNow;
                var endDate = startDate.AddDays(days);

                var events = await _context.Events
                    .Include(e => e.Hobby)
                    .Include(e => e.Place)
                    .Include(e => e.CreatorUser)
                    .Include(e => e.Participants)
                    .Where(e => e.StartDateTime >= startDate && e.StartDateTime <= endDate)
                    .OrderBy(e => e.StartDateTime)
                    .Take(20)
                    .ToListAsync();

                var eventResponses = events.Select(e => new EventResponse
                {
                    EventId = e.EventId,
                    Title = e.Title,
                    Description = e.Description,
                    CreatorUserId = e.CreatorUserId,
                    CreatorName = e.CreatorUser?.Username ?? "Unknown",
                    HobbyId = e.HobbyId,
                    HobbyName = e.Hobby?.Name ?? "General",
                    PlaceId = e.PlaceId,
                    PlaceName = e.Place?.Name ?? e.CustomLocationName ?? "Custom Location",
                    Location = e.Place?.Address ?? e.CustomLocationAddress ?? "Location TBD",
                    Latitude = (double?)e.Latitude,
                    Longitude = (double?)e.Longitude,
                    StartTime = e.StartDateTime,
                    EndTime = e.EndDateTime,
                    MaxParticipants = e.MaxParticipants,
                    CurrentParticipants = e.Participants.Count,
                    Price = e.EntryFee,
                    ImageUrl = !string.IsNullOrEmpty(e.ImageUrls) ? e.ImageUrls : null,
                    Status = e.StartDateTime > DateTime.UtcNow ? "Upcoming" : "Live",
                    IsPublic = e.IsPublic,
                    RequiresApproval = e.RequiresApproval,
                    Requirements = null, // This property doesn't exist in the Event entity based on the error
                    CreatedAt = e.CreatedAt,
                    UpdatedAt = e.UpdatedAt,
                    IsParticipant = false, // This would need to be calculated based on current user
                    ParticipationStatus = null
                }).ToList();

                return ApiResponse<List<EventResponse>>.SuccessResult(eventResponses);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<EventResponse>>.ErrorResult($"Failed to fetch upcoming events: {ex.Message}");
            }
        }

        public Task<ApiResponse<List<EventResponse>>> GetPopularEventsAsync(int count = 10, Guid? currentUserId = null)
        {
            return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Event service not fully implemented yet"));
        }
    }
}








// using Microsoft.EntityFrameworkCore;
// using Same.Data;
// using Same.Models.DTOs.Responses;
// using Same.Services.Interfaces;

// namespace Same.Services.Implementations
// {
//     public class EventService : IEventService
//     {
//         private readonly ApplicationDbContext _context;

//         public EventService(ApplicationDbContext context)
//         {
//             _context = context;
//         }

//         public Task<ApiResponse<EventResponse>> CreateEventAsync(Guid creatorId, CreateEventRequest request)
//         {
//             return Task.FromResult(ApiResponse<EventResponse>.ErrorResult("Event service not fully implemented yet"));
//         }

//         public Task<ApiResponse<EventResponse>> GetEventByIdAsync(Guid eventId, Guid? currentUserId = null)
//         {
//             return Task.FromResult(ApiResponse<EventResponse>.ErrorResult("Event service not fully implemented yet"));
//         }

//         public Task<ApiResponse<List<EventResponse>>> GetEventsByCreatorAsync(Guid creatorId)
//         {
//             return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Event service not fully implemented yet"));
//         }

//         public Task<ApiResponse<List<EventResponse>>> SearchEventsAsync(SearchEventsRequest request, Guid? currentUserId = null)
//         {
//             return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Event service not fully implemented yet"));
//         }

//         public Task<ApiResponse<EventResponse>> UpdateEventAsync(Guid eventId, Guid creatorId, UpdateEventRequest request)
//         {
//             return Task.FromResult(ApiResponse<EventResponse>.ErrorResult("Event service not fully implemented yet"));
//         }

//         public Task<ApiResponse<bool>> DeleteEventAsync(Guid eventId, Guid creatorId)
//         {
//             return Task.FromResult(ApiResponse<bool>.ErrorResult("Event service not fully implemented yet"));
//         }

//         public Task<ApiResponse<bool>> JoinEventAsync(Guid eventId, Guid userId)
//         {
//             return Task.FromResult(ApiResponse<bool>.ErrorResult("Event service not fully implemented yet"));
//         }

//         public Task<ApiResponse<bool>> LeaveEventAsync(Guid eventId, Guid userId)
//         {
//             return Task.FromResult(ApiResponse<bool>.ErrorResult("Event service not fully implemented yet"));
//         }

//         public Task<ApiResponse<List<UserResponse>>> GetEventParticipantsAsync(Guid eventId)
//         {
//             return Task.FromResult(ApiResponse<List<UserResponse>>.ErrorResult("Event service not fully implemented yet"));
//         }

//         public Task<ApiResponse<List<EventResponse>>> GetUserEventsAsync(Guid userId)
//         {
//             return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Event service not fully implemented yet"));
//         }

//         public Task<ApiResponse<bool>> InviteToEventAsync(Guid eventId, Guid creatorId, List<Guid> userIds)
//         {
//             return Task.FromResult(ApiResponse<bool>.ErrorResult("Event service not fully implemented yet"));
//         }

//         public Task<ApiResponse<List<EventResponse>>> GetNearbyEventsAsync(decimal latitude, decimal longitude, double radiusKm = 10, Guid? currentUserId = null)
//         {
//             return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Event service not fully implemented yet"));
//         }

//         public Task<ApiResponse<List<EventResponse>>> GetEventsByHobbyAsync(Guid hobbyId, Guid? currentUserId = null)
//         {
//             return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Event service not fully implemented yet"));
//         }

//         public Task<ApiResponse<List<EventResponse>>> GetEventsByPlaceAsync(Guid placeId, Guid? currentUserId = null)
//         {
//             return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Event service not fully implemented yet"));
//         }

//         public async Task<ApiResponse<List<EventResponse>>> GetUpcomingEventsAsync(Guid userId, int days = 7)
//         {
//             try
//             {
//                 var startDate = DateTime.UtcNow;
//                 var endDate = startDate.AddDays(days);

//                 var events = await _context.Events
//                     .Include(e => e.Hobby)
//                     .Include(e => e.Place)
//                     .Include(e => e.Participants)
//                     .Where(e => e.StartDateTime >= startDate && e.StartDateTime <= endDate)
//                     .OrderBy(e => e.StartDateTime)
//                     .Take(20)
//                     .ToListAsync();

//                 var eventResponses = events.Select(e => new EventResponse
//                 {
//                     EventId = e.EventId,
//                     Title = e.Title,
//                     Description = e.Description,
//                     CreatorUserId = e.CreatorUserId,
//                     CreatorName = e.CreatorUser?.Username,
//                     HobbyId = e.HobbyId,
//                     HobbyName = e.Hobby?.Name ?? "General",
//                     PlaceId = e.PlaceId,
//                     PlaceName = e.Place?.Name,
//                     Location = e.Place?.Address ?? "Location TBD",
//                     Latitude = e.Place?.Latitude,
//                     Longitude = e.Place?.Longitude,
//                     StartTime = e.StartDateTime,
//                     EndTime = e.EndDateTime,
//                     MaxParticipants = e.MaxParticipants ?? 0,
//                     CurrentParticipants = e.Participants.Count,
//                     Price = e.Price,
//                     ImageUrl = e.ImageUrl,
//                     Status = e.StartDateTime > DateTime.UtcNow ? "Upcoming" : "Live",
//                     IsPublic = e.IsPublic,
//                     RequiresApproval = e.RequiresApproval,
//                     Requirements = e.Requirements,
//                     CreatedAt = e.CreatedAt,
//                     UpdatedAt = e.UpdatedAt,
//                     IsParticipant = false, // This would need to be calculated based on current user
//                     ParticipationStatus = null
//                 }).ToList();

//                 return ApiResponse<List<EventResponse>>.SuccessResult(eventResponses);
//             }
//             catch (Exception ex)
//             {
//                 return ApiResponse<List<EventResponse>>.ErrorResult($"Failed to fetch upcoming events: {ex.Message}");
//             }
//         }

//         public Task<ApiResponse<List<EventResponse>>> GetPopularEventsAsync(int count = 10, Guid? currentUserId = null)
//         {
//             return Task.FromResult(ApiResponse<List<EventResponse>>.ErrorResult("Event service not fully implemented yet"));
//         }
//     }
// }