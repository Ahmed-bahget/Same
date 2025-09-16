using Same.Models.DTOs.Responses;

namespace Same.Services.Interfaces
{
    public interface IOrderService
    {
        // Order Management
        Task<ApiResponse<OrderResponse>> CreateOrderAsync(Guid buyerId, CreateOrderRequest request);
        Task<ApiResponse<OrderResponse>> GetOrderByIdAsync(Guid orderId, Guid userId);
        Task<ApiResponse<List<OrderResponse>>> GetOrdersByBuyerAsync(Guid buyerId);
        Task<ApiResponse<List<OrderResponse>>> GetOrdersBySellerAsync(Guid sellerId);
        Task<ApiResponse<List<OrderResponse>>> GetOrdersByDeliveryPersonAsync(Guid deliveryPersonId);
        Task<ApiResponse<List<OrderResponse>>> GetOrdersByBrokerAsync(Guid brokerId);

        // Order Status Management
        Task<ApiResponse<OrderResponse>> UpdateOrderStatusAsync(Guid orderId, Guid userId, UpdateOrderStatusRequest request);
        Task<ApiResponse<bool>> CancelOrderAsync(Guid orderId, Guid userId, string reason);
        Task<ApiResponse<bool>> AcceptOrderAsync(Guid orderId, Guid sellerId);
        Task<ApiResponse<bool>> CompleteOrderAsync(Guid orderId, Guid userId);

        // Delivery Management
        Task<ApiResponse<bool>> AssignDeliveryPersonAsync(Guid orderId, Guid deliveryPersonId);
        Task<ApiResponse<List<OrderResponse>>> GetAvailableDeliveryOrdersAsync(Guid deliveryPersonId, double radiusKm = 10);
        Task<ApiResponse<bool>> AcceptDeliveryAsync(Guid orderId, Guid deliveryPersonId);
        Task<ApiResponse<bool>> UpdateDeliveryStatusAsync(Guid orderId, Guid deliveryPersonId, string status, decimal? latitude = null, decimal? longitude = null);

        // Broker Features
        Task<ApiResponse<bool>> AssignBrokerAsync(Guid orderId, Guid brokerId);
        Task<ApiResponse<List<OrderResponse>>> GetAvailableBrokerOrdersAsync(Guid brokerId, double radiusKm = 10);
        Task<ApiResponse<bool>> AcceptBrokerRoleAsync(Guid orderId, Guid brokerId);

        // Analytics & Reports
        Task<ApiResponse<object>> GetOrderStatsAsync(Guid userId, string role); // buyer, seller, delivery, broker
        Task<ApiResponse<List<OrderResponse>>> GetActiveOrdersAsync();

    }

    public class CreateOrderRequest
    {
        public List<OrderItemRequest> Items { get; set; } = new List<OrderItemRequest>();
        public string? ShippingAddress { get; set; }
        public string? Notes { get; set; }
        public string DeliveryMethod { get; set; } = "Pickup"; // Pickup, Delivery, Shipping
        public DateTime? PreferredDeliveryDate { get; set; }
        public bool RequiresBroker { get; set; } = false;
        public decimal? OfferPrice { get; set; } // For negotiation
    }

    public class OrderItemRequest
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal? NegotiatedPrice { get; set; }
        public string? SpecialInstructions { get; set; }
    }

    public class UpdateOrderStatusRequest
    {
        public string Status { get; set; } = string.Empty; // Pending, Accepted, InProgress, Shipped, Delivered, Completed, Cancelled
        public string? Notes { get; set; }
        public string? TrackingNumber { get; set; }
        public DateTime? EstimatedDelivery { get; set; }
        public decimal? DeliveryFee { get; set; }
        public decimal? BrokerFee { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }
}