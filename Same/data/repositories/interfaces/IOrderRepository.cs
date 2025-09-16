using Same.Models.Entities;

namespace Same.Data.Repositories.Interfaces
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<IEnumerable<Order>> GetByBuyerAsync(Guid buyerId);
        Task<IEnumerable<Order>> GetBySellerAsync(Guid sellerId);
        Task<IEnumerable<Order>> GetByDeliveryUserAsync(Guid deliveryUserId);
        Task<IEnumerable<Order>> GetByBrokerAsync(Guid brokerId);
        Task<IEnumerable<Order>> GetByStatusAsync(string status);
        Task<Order?> GetWithItemsAsync(Guid orderId);
        Task<decimal> GetTotalSalesBySellerAsync(Guid sellerId, DateTime? fromDate = null, DateTime? toDate = null);
    }
}