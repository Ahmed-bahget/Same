using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Same.Services.Interfaces;
using Same.Models.Dtos.Requests.Place;
using Same.Models.DTOs.Responses;
using static Same.Services.Interfaces.IPlaceService;

namespace Same.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlaceController : ControllerBase
    {
        private readonly IPlaceService _placeService;

        public PlaceController(IPlaceService placeService)
        {
            _placeService = placeService;
        }

        /// <summary>
        /// Get all places with pagination
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<List<PlaceResponse>>), 200)]
        public async Task<IActionResult> GetAllPlaces([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            // Use search with empty criteria to get all places
            var searchRequest = new SearchPlacesRequest { Page = page, PageSize = pageSize };
            var result = await _placeService.SearchPlacesAsync(searchRequest);
            return Ok(result);
        }

        /// <summary>
        /// Get place by ID
        /// </summary>
        [HttpGet("{placeId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<PlaceResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<PlaceResponse>), 404)]
        public async Task<IActionResult> GetPlaceById(Guid placeId)
        {
            var result = await _placeService.GetPlaceByIdAsync(placeId);
            
            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        /// <summary>
        /// Search places by location
        /// </summary>
        [HttpGet("search/location")]
        [ProducesResponseType(typeof(ApiResponse<List<PlaceResponse>>), 200)]
        public async Task<IActionResult> SearchPlacesByLocation(
            [FromQuery] decimal latitude,
            [FromQuery] decimal longitude,
            [FromQuery] int radiusKm = 10)
        {
            var result = await _placeService.GetNearbyPlacesAsync(latitude, longitude, radiusKm);
            return Ok(result);
        }

        /// <summary>
        /// Search places by text
        /// </summary>
        [HttpGet("search")]
        [ProducesResponseType(typeof(ApiResponse<List<PlaceResponse>>), 200)]
        public async Task<IActionResult> SearchPlaces([FromQuery] string searchTerm, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var searchRequest = new SearchPlacesRequest { Name = searchTerm, Page = page, PageSize = pageSize };
            var result = await _placeService.SearchPlacesAsync(searchRequest);
            return Ok(result);
        }

        /// <summary>
        /// Get places by type
        /// </summary>
        [HttpGet("type/{placeType}")]
        [ProducesResponseType(typeof(ApiResponse<List<PlaceResponse>>), 200)]
        public async Task<IActionResult> GetPlacesByType(string placeType)
        {
            var result = await _placeService.GetPlacesByTypeAsync(placeType);
            return Ok(result);
        }

        /// <summary>
        /// Get places for sale
        /// </summary>
        [HttpGet("for-sale")]
        [ProducesResponseType(typeof(ApiResponse<List<PlaceResponse>>), 200)]
        public async Task<IActionResult> GetPlacesForSale([FromQuery] decimal? minPrice = null, [FromQuery] decimal? maxPrice = null)
        {
            var searchRequest = new SearchPlacesRequest { IsForSale = true, MinPrice = minPrice, MaxPrice = maxPrice };
            var result = await _placeService.GetPlacesForSaleAsync(searchRequest);
            return Ok(result);
        }

        /// <summary>
        /// Get places for rent
        /// </summary>
        [HttpGet("for-rent")]
        [ProducesResponseType(typeof(ApiResponse<List<PlaceResponse>>), 200)]
        public async Task<IActionResult> GetPlacesForRent([FromQuery] decimal? minPrice = null, [FromQuery] decimal? maxPrice = null)
        {
            var searchRequest = new SearchPlacesRequest { IsForRent = true, MinPrice = minPrice, MaxPrice = maxPrice };
            var result = await _placeService.GetPlacesForRentAsync(searchRequest);
            return Ok(result);
        }

        /// <summary>
        /// Get popular places
        /// </summary>
        [HttpGet("popular")]
        [ProducesResponseType(typeof(ApiResponse<List<PlaceResponse>>), 200)]
        public async Task<IActionResult> GetPopularPlaces([FromQuery] int count = 10)
        {
            var result = await _placeService.GetPopularPlacesAsync(count);
            return Ok(result);
        }

        /// <summary>
        /// Create a new place
        /// </summary>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<PlaceResponse>), 201)]
        [ProducesResponseType(typeof(ApiResponse<PlaceResponse>), 400)]
        public async Task<IActionResult> CreatePlace([FromBody] Same.Services.Interfaces.CreatePlaceRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<PlaceResponse>.ErrorResult("Invalid data", ModelState));

            var userId = GetCurrentUserId();
            var result = await _placeService.CreatePlaceAsync(userId, request);
            
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetPlaceById), new { placeId = result.Data!.PlaceId }, result);
        }

        /// <summary>
        /// Update place
        /// </summary>
        [HttpPut("{placeId:guid}")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<PlaceResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<PlaceResponse>), 400)]
        [ProducesResponseType(typeof(ApiResponse<PlaceResponse>), 404)]
        public async Task<IActionResult> UpdatePlace(Guid placeId, [FromBody] Same.Services.Interfaces.UpdatePlaceRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<PlaceResponse>.ErrorResult("Invalid data", ModelState));

            var userId = GetCurrentUserId();
            var result = await _placeService.UpdatePlaceAsync(placeId, userId, request);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Delete place (soft delete)
        /// </summary>
        [HttpDelete("{placeId:guid}")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(typeof(ApiResponse<bool>), 404)]
        public async Task<IActionResult> DeletePlace(Guid placeId)
        {
            var userId = GetCurrentUserId();
            var result = await _placeService.DeletePlaceAsync(placeId, userId);
            
            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        /// <summary>
        /// Get user's places
        /// </summary>
        [HttpGet("my-places")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<List<PlaceResponse>>), 200)]
        public async Task<IActionResult> GetMyPlaces()
        {
            var userId = GetCurrentUserId();
            var result = await _placeService.GetPlacesByOwnerAsync(userId);
            return Ok(result);
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }
    }
}