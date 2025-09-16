namespace Same.Models.DTOs.Responses
{
    public class OrderResponse
    {
        public Guid OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public Guid BuyerUserId { get; set; }
        public string BuyerName { get; set; } = string.Empty;
        public Guid? SellerUserId { get; set; }
        public string? SellerName { get; set; }
        public Guid? DeliveryUserId { get; set; }
        public string? DeliveryUserName { get; set; }
        public string OrderType { get; set; } = string.Empty; // Product, Service, Place
        public decimal TotalAmount { get; set; }
        public decimal DeliveryFee { get; set; }
        public decimal AppCommission { get; set; }
        public decimal BrokerCommission { get; set; }
        public string Status { get; set; } = string.Empty; // Pending, Confirmed, InProgress, Delivered, Completed, Cancelled
        public string PaymentStatus { get; set; } = string.Empty; // Pending, Paid, Failed, Refunded
        public string? DeliveryAddress { get; set; }
        public double? DeliveryLatitude { get; set; }
        public double? DeliveryLongitude { get; set; }
        public DateTime? DeliveryTime { get; set; }
        public string? SpecialInstructions { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<OrderItemResponse> Items { get; set; } = new();
    }

    public class OrderItemResponse
    {
        public Guid OrderItemId { get; set; }
        public Guid? ProductId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string? ItemDescription { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}