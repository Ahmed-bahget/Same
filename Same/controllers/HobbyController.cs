using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Same.Services.Interfaces;
using Same.Models.DTOs.Responses;

namespace Same.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HobbyController : ControllerBase
    {
        private readonly IHobbyService _hobbyService;
        private readonly IUserService _userService;

        public HobbyController(IHobbyService hobbyService, IUserService userService)
        {
            _hobbyService = hobbyService;
            _userService = userService;
        }

        /// <summary>
        /// Get all hobbies
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<List<HobbyResponse>>), 200)]
        public async Task<IActionResult> GetAllHobbies()
        {
            var result = await _hobbyService.GetAllHobbiesAsync();
            return Ok(result);
        }

        /// <summary>
        /// Get hobby by ID
        /// </summary>
        [HttpGet("{hobbyId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<HobbyResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<HobbyResponse>), 404)]
        public async Task<IActionResult> GetHobbyById(Guid hobbyId)
        {
            var result = await _hobbyService.GetHobbyByIdAsync(hobbyId);
            
            if (!result.Success)
                return NotFound(result);
                
            return Ok(result);
        }

        /// <summary>
        /// Get hobbies by type (Sports, Arts, Music, etc.)
        /// </summary>
        [HttpGet("type/{type}")]
        [ProducesResponseType(typeof(ApiResponse<List<HobbyResponse>>), 200)]
        public async Task<IActionResult> GetHobbiesByType(string type)
        {
            var result = await _hobbyService.GetHobbiesByTypeAsync(type);
            return Ok(result);
        }

        /// <summary>
        /// Search hobbies by name or description
        /// </summary>
        [HttpGet("search")]
        [ProducesResponseType(typeof(ApiResponse<List<HobbyResponse>>), 200)]
        public async Task<IActionResult> SearchHobbies([FromQuery] string searchTerm)
        {
            var result = await _hobbyService.SearchHobbiesAsync(searchTerm);
            return Ok(result);
        }

        /// <summary>
        /// Get popular hobbies by community size
        /// </summary>
        [HttpGet("popular")]
        [ProducesResponseType(typeof(ApiResponse<List<HobbyResponse>>), 200)]
        public async Task<IActionResult> GetPopularHobbies([FromQuery] int count = 10)
        {
            var result = await _hobbyService.GetPopularHobbiesAsync(count);
            return Ok(result);
        }

        /// <summary>
        /// Create a new hobby
        /// </summary>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<HobbyResponse>), 201)]
        [ProducesResponseType(typeof(ApiResponse<HobbyResponse>), 400)]
        public async Task<IActionResult> CreateHobby([FromBody] CreateHobbyRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<HobbyResponse>.ErrorResult("Invalid data", ModelState));

            var result = await _hobbyService.CreateHobbyAsync(request);
            
            if (!result.Success)
                return BadRequest(result);
                
            return CreatedAtAction(nameof(GetHobbyById), new { hobbyId = result.Data!.HobbyId }, result);
        }

        /// <summary>
        /// Update hobby information
        /// </summary>
        [HttpPut("{hobbyId:guid}")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<HobbyResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<HobbyResponse>), 400)]
        [ProducesResponseType(typeof(ApiResponse<HobbyResponse>), 404)]
        public async Task<IActionResult> UpdateHobby(Guid hobbyId, [FromBody] UpdateHobbyRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<HobbyResponse>.ErrorResult("Invalid data", ModelState));

            var result = await _hobbyService.UpdateHobbyAsync(hobbyId, request);
            
            if (!result.Success)
                return BadRequest(result);
                
            return Ok(result);
        }

        /// <summary>
        /// Delete a hobby (soft delete)
        /// </summary>
        [HttpDelete("{hobbyId:guid}")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(typeof(ApiResponse<bool>), 404)]
        public async Task<IActionResult> DeleteHobby(Guid hobbyId)
        {
            var result = await _hobbyService.DeleteHobbyAsync(hobbyId);
            
            if (!result.Success)
                return NotFound(result);
                
            return Ok(result);
        }

        /// <summary>
        /// Get hobby members/community
        /// </summary>
        [HttpGet("{hobbyId:guid}/members")]
        [ProducesResponseType(typeof(ApiResponse<List<UserResponse>>), 200)]
        public async Task<IActionResult> GetHobbyMembers(Guid hobbyId)
        {
            var result = await _hobbyService.GetHobbyMembersAsync(hobbyId);
            return Ok(result);
        }

        /// <summary>
        /// Get events for a specific hobby
        /// </summary>
        [HttpGet("{hobbyId:guid}/events")]
        [ProducesResponseType(typeof(ApiResponse<List<EventResponse>>), 200)]
        public async Task<IActionResult> GetHobbyEvents(Guid hobbyId)
        {
            var result = await _hobbyService.GetHobbyEventsAsync(hobbyId);
            return Ok(result);
        }

        /// <summary>
        /// Join a hobby (add to user's hobbies)
        /// </summary>
        [HttpPost("{hobbyId:guid}/join")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(typeof(ApiResponse<bool>), 400)]
        public async Task<IActionResult> JoinHobby(Guid hobbyId, [FromBody] JoinHobbyRequest? request = null)
        {
            var userId = GetCurrentUserId();
            var skillLevel = request?.SkillLevel ?? "Beginner";
            var yearsExperience = request?.YearsExperience ?? 0;
            
            var result = await _userService.AddUserHobbyAsync(userId, hobbyId, skillLevel, yearsExperience);
            
            if (!result.Success)
                return BadRequest(result);
                
            return Ok(result);
        }

        /// <summary>
        /// Leave a hobby (remove from user's hobbies)
        /// </summary>
        [HttpDelete("{hobbyId:guid}/leave")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(typeof(ApiResponse<bool>), 400)]
        public async Task<IActionResult> LeaveHobby(Guid hobbyId)
        {
            var userId = GetCurrentUserId();
            var result = await _userService.RemoveUserHobbyAsync(userId, hobbyId);
            
            if (!result.Success)
                return BadRequest(result);
                
            return Ok(result);
        }

        /// <summary>
        /// Get users who share the same hobby
        /// </summary>
        [HttpGet("{hobbyId:guid}/users")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<List<UserResponse>>), 200)]
        public async Task<IActionResult> GetUsersByHobby(Guid hobbyId)
        {
            var currentUserId = GetCurrentUserId();
            var result = await _userService.GetUsersByHobbyAsync(hobbyId, currentUserId);
            return Ok(result);
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }
    }

    public class JoinHobbyRequest
    {
        public string SkillLevel { get; set; } = "Beginner"; // Beginner, Intermediate, Advanced, Expert
        public int YearsExperience { get; set; } = 0;
        public string? PersonalDescription { get; set; }
    }
}