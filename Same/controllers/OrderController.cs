using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Same.Services.Interfaces;
using Same.Models.Dtos.Requests.Order;
using Same.Models.DTOs.Responses;
using static Same.Services.Interfaces.IOrderService;

namespace Same.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        /// <summary>
        /// Create a new order
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<OrderResponse>), 201)]
        [ProducesResponseType(typeof(ApiResponse<OrderResponse>), 400)]
        public async Task<IActionResult> CreateOrder([FromBody] Same.Services.Interfaces.CreateOrderRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<OrderResponse>.ErrorResult("Invalid data", ModelState));

            var userId = GetCurrentUserId();
            var result = await _orderService.CreateOrderAsync(userId, request);
            
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetOrderById), new { orderId = result.Data!.OrderId }, result);
        }

        /// <summary>
        /// Get order by ID
        /// </summary>
        [HttpGet("{orderId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<OrderResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<OrderResponse>), 404)]
        public async Task<IActionResult> GetOrderById(Guid orderId)
        {
            var userId = GetCurrentUserId();
            var result = await _orderService.GetOrderByIdAsync(orderId, userId);
            
            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        /// <summary>
        /// Get user's orders as buyer
        /// </summary>
        [HttpGet("buyer")]
        [ProducesResponseType(typeof(ApiResponse<List<OrderResponse>>), 200)]
        public async Task<IActionResult> GetBuyerOrders()
        {
            var userId = GetCurrentUserId();
            var result = await _orderService.GetOrdersByBuyerAsync(userId);
            return Ok(result);
        }

        /// <summary>
        /// Get user's orders as seller
        /// </summary>
        [HttpGet("seller")]
        [ProducesResponseType(typeof(ApiResponse<List<OrderResponse>>), 200)]
        public async Task<IActionResult> GetSellerOrders()
        {
            var userId = GetCurrentUserId();
            var result = await _orderService.GetOrdersBySellerAsync(userId);
            return Ok(result);
        }

        /// <summary>
        /// Get user's orders as delivery person
        /// </summary>
        [HttpGet("delivery")]
        [ProducesResponseType(typeof(ApiResponse<List<OrderResponse>>), 200)]
        public async Task<IActionResult> GetDeliveryOrders()
        {
            var userId = GetCurrentUserId();
            var result = await _orderService.GetOrdersByDeliveryPersonAsync(userId);
            return Ok(result);
        }

        /// <summary>
        /// Update order status
        /// </summary>
        [HttpPatch("{orderId:guid}/status")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(typeof(ApiResponse<bool>), 400)]
        public async Task<IActionResult> UpdateOrderStatus(Guid orderId, [FromBody] string newStatus)
        {
            var userId = GetCurrentUserId();
            var updateRequest = new UpdateOrderStatusRequest { Status = newStatus };
            var result = await _orderService.UpdateOrderStatusAsync(orderId, userId, updateRequest);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Cancel order
        /// </summary>
        [HttpPost("{orderId:guid}/cancel")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(typeof(ApiResponse<bool>), 400)]
        public async Task<IActionResult> CancelOrder(Guid orderId)
        {
            var userId = GetCurrentUserId();
            var result = await _orderService.CancelOrderAsync(orderId, userId, "Cancelled by user");
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }
    }
}