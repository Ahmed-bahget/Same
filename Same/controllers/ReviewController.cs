using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Same.Services.Interfaces;
using Same.Models.DTOs.Responses;
using Same.Models.Dtos.Requests;

namespace Same.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        /// <summary>
        /// Create a review
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<ReviewResponse>), 201)]
        [ProducesResponseType(typeof(ApiResponse<ReviewResponse>), 400)]
        public async Task<IActionResult> CreateReview([FromBody] Same.Services.Interfaces.CreateReviewRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<ReviewResponse>.ErrorResult("Invalid data", ModelState));

            var userId = GetCurrentUserId();
            var result = await _reviewService.CreateReviewAsync(userId, request);
            
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetReviewById), new { reviewId = result.Data!.ReviewId }, result);
        }

        /// <summary>
        /// Get review by ID
        /// </summary>
        [HttpGet("{reviewId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<ReviewResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<ReviewResponse>), 404)]
        public async Task<IActionResult> GetReviewById(Guid reviewId)
        {
            var result = await _reviewService.GetReviewByIdAsync(reviewId);
            
            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        /// <summary>
        /// Get reviews for a user
        /// </summary>
        [HttpGet("user/{userId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<List<ReviewResponse>>), 200)]
        public async Task<IActionResult> GetUserReviews(Guid userId)
        {
            var result = await _reviewService.GetUserReviewsAsync(userId);
            return Ok(result);
        }

        /// <summary>
        /// Get reviews for a product
        /// </summary>
        [HttpGet("product/{productId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<List<ReviewResponse>>), 200)]
        public async Task<IActionResult> GetProductReviews(Guid productId)
        {
            var result = await _reviewService.GetProductReviewsAsync(productId);
            return Ok(result);
        }

        /// <summary>
        /// Get reviews for an event
        /// </summary>
        [HttpGet("event/{eventId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<List<ReviewResponse>>), 200)]
        public async Task<IActionResult> GetEventReviews(Guid eventId)
        {
            var result = await _reviewService.GetEventReviewsAsync(eventId);
            return Ok(result);
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }
    }
}