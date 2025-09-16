using System.ComponentModel.DataAnnotations;

namespace Same.Models.Dtos.Requests.Order
{
    public class CreateOrderRequest
    {
        [Required]
        public List<OrderItemRequest> Items { get; set; } = new();

        [StringLength(500)]
        public string? DeliveryAddress { get; set; }

        public decimal? DeliveryLatitude { get; set; }
        public decimal? DeliveryLongitude { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }

        public string PaymentMethod { get; set; } = "Cash";

        public bool IsDelivery { get; set; } = true;

        // Optional: Request specific delivery person
        public Guid? PreferredDeliveryUserId { get; set; }

        // Optional: Request broker services
        public bool RequiresBroker { get; set; } = false;
    }

    public class OrderItemRequest
    {
        [Required]
        public Guid ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [StringLength(500)]
        public string? SpecialInstructions { get; set; }
    }
}