using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Same.Services.Interfaces;
using Same.Models.Dtos.Requests.Product;
using Same.Models.DTOs.Responses;
using static Same.Services.Interfaces.IProductService;

namespace Same.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        /// <summary>
        /// Get all products with pagination
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<List<ProductResponse>>), 200)]
        public async Task<IActionResult> GetAllProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            // Use search with empty criteria to get all products
            var searchRequest = new SearchProductsRequest { Page = page, PageSize = pageSize };
            var result = await _productService.SearchProductsAsync(searchRequest);
            return Ok(result);
        }

        /// <summary>
        /// Get product by ID
        /// </summary>
        [HttpGet("{productId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<ProductResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<ProductResponse>), 404)]
        public async Task<IActionResult> GetProductById(Guid productId)
        {
            var result = await _productService.GetProductByIdAsync(productId);
            
            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        /// <summary>
        /// Search products
        /// </summary>
        [HttpGet("search")]
        [ProducesResponseType(typeof(ApiResponse<List<ProductResponse>>), 200)]
        public async Task<IActionResult> SearchProducts([FromQuery] string searchTerm, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var searchRequest = new SearchProductsRequest { Name = searchTerm, Page = page, PageSize = pageSize };
            var result = await _productService.SearchProductsAsync(searchRequest);
            return Ok(result);
        }

        /// <summary>
        /// Get products by category
        /// </summary>
        [HttpGet("category/{category}")]
        [ProducesResponseType(typeof(ApiResponse<List<ProductResponse>>), 200)]
        public async Task<IActionResult> GetProductsByCategory(string category)
        {
            var result = await _productService.GetProductsByCategoryAsync(category);
            return Ok(result);
        }

        /// <summary>
        /// Get products by place
        /// </summary>
        [HttpGet("place/{placeId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<List<ProductResponse>>), 200)]
        public async Task<IActionResult> GetProductsByPlace(Guid placeId)
        {
            var result = await _productService.GetProductsByPlaceAsync(placeId);
            return Ok(result);
        }

        /// <summary>
        /// Create a new product
        /// </summary>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<ProductResponse>), 201)]
        [ProducesResponseType(typeof(ApiResponse<ProductResponse>), 400)]
        public async Task<IActionResult> CreateProduct([FromBody] Same.Services.Interfaces.CreateProductRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<ProductResponse>.ErrorResult("Invalid data", ModelState));

            var userId = GetCurrentUserId();
            var result = await _productService.CreateProductAsync(userId, request);
            
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetProductById), new { productId = result.Data!.ProductId }, result);
        }

        /// <summary>
        /// Get user's products
        /// </summary>
        [HttpGet("my-products")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<List<ProductResponse>>), 200)]
        public async Task<IActionResult> GetMyProducts()
        {
            var userId = GetCurrentUserId();
            var result = await _productService.GetProductsBySellerAsync(userId);
            return Ok(result);
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }
    }
}