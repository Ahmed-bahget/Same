using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Same.Services.Interfaces;
using Same.Models.Dtos.Requests.Event;
using Same.Models.DTOs.Responses;

namespace Same.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }

        /// <summary>
        /// Get all upcoming events with pagination
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<List<EventResponse>>), 200)]
        public async Task<IActionResult> GetUpcomingEvents([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            // Use the existing service method with userId parameter
            var result = await _eventService.GetUpcomingEventsAsync(Guid.Empty, 7); // Get upcoming events for 7 days
            return Ok(result);
        }

        /// <summary>
        /// Get event by ID
        /// </summary>
        [HttpGet("{eventId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<EventResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<EventResponse>), 404)]
        public async Task<IActionResult> GetEventById(Guid eventId)
        {
            var result = await _eventService.GetEventByIdAsync(eventId);
            
            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        /// <summary>
        /// Get events by hobby
        /// </summary>
        [HttpGet("hobby/{hobbyId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<List<EventResponse>>), 200)]
        public async Task<IActionResult> GetEventsByHobby(Guid hobbyId)
        {
            var result = await _eventService.GetEventsByHobbyAsync(hobbyId);
            return Ok(result);
        }

        /// <summary>
        /// Get events by location
        /// </summary>
        [HttpGet("location")]
        [ProducesResponseType(typeof(ApiResponse<List<EventResponse>>), 200)]
        public async Task<IActionResult> GetEventsByLocation(
            [FromQuery] decimal latitude,
            [FromQuery] decimal longitude,
            [FromQuery] int radiusKm = 10)
        {
            var result = await _eventService.GetNearbyEventsAsync(latitude, longitude, radiusKm);
            return Ok(result);
        }

        /// <summary>
        /// Create a new event
        /// </summary>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<EventResponse>), 201)]
        [ProducesResponseType(typeof(ApiResponse<EventResponse>), 400)]
        public async Task<IActionResult> CreateEvent([FromBody] Same.Services.Interfaces.CreateEventRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<EventResponse>.ErrorResult("Invalid data", ModelState));

            var userId = GetCurrentUserId();
            var result = await _eventService.CreateEventAsync(userId, request);
            
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetEventById), new { eventId = result.Data!.EventId }, result);
        }

        /// <summary>
        /// Join an event
        /// </summary>
        [HttpPost("{eventId:guid}/join")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(typeof(ApiResponse<bool>), 400)]
        public async Task<IActionResult> JoinEvent(Guid eventId, [FromBody] JoinEventRequest? request = null)
        {
            var userId = GetCurrentUserId();
            var result = await _eventService.JoinEventAsync(eventId, userId);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Leave an event
        /// </summary>
        [HttpPost("{eventId:guid}/leave")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> LeaveEvent(Guid eventId)
        {
            var userId = GetCurrentUserId();
            var result = await _eventService.LeaveEventAsync(userId, eventId);
            return Ok(result);
        }

        /// <summary>
        /// Get user's events
        /// </summary>
        [HttpGet("my-events")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<List<EventResponse>>), 200)]
        public async Task<IActionResult> GetMyEvents([FromQuery] string filter = "all")
        {
            var userId = GetCurrentUserId();
            var result = await _eventService.GetUserEventsAsync(userId);
            return Ok(result);
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }
    }
}