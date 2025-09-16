using Microsoft.EntityFrameworkCore;
using Same.Data.Repositories.Interfaces;
using Same.Models.Entities;

namespace Same.Data.Repositories.Implementations
{
    public class OrderRepository : Repository<Order>, IOrderRepository
    {
        public OrderRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Order>> GetByBuyerAsync(Guid buyerId) =>
            await _context.Orders.Where(o => o.BuyerUserId == buyerId)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Include(o => o.SellerUser).Include(o => o.DeliveryUser)
                .OrderByDescending(o => o.CreatedAt).ToListAsync();

        public async Task<IEnumerable<Order>> GetBySellerAsync(Guid sellerId) =>
            await _context.Orders.Where(o => o.SellerUserId == sellerId)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Include(o => o.BuyerUser).Include(o => o.DeliveryUser)
                .OrderByDescending(o => o.CreatedAt).ToListAsync();

        public async Task<IEnumerable<Order>> GetByDeliveryUserAsync(Guid deliveryUserId) =>
            await _context.Orders.Where(o => o.DeliveryUserId == deliveryUserId)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Include(o => o.BuyerUser).Include(o => o.SellerUser)
                .OrderByDescending(o => o.CreatedAt).ToListAsync();

        public async Task<IEnumerable<Order>> GetByBrokerAsync(Guid brokerId) =>
            await _context.Orders.Where(o => o.BrokerUserId == brokerId)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Include(o => o.BuyerUser).Include(o => o.SellerUser)
                .OrderByDescending(o => o.CreatedAt).ToListAsync();

        public async Task<IEnumerable<Order>> GetByStatusAsync(string status) =>
            await _context.Orders.Where(o => o.Status == status)
                .Include(o => o.BuyerUser).Include(o => o.SellerUser)
                .OrderByDescending(o => o.CreatedAt).ToListAsync();

        public async Task<Order?> GetWithItemsAsync(Guid orderId) =>
            await _context.Orders.Include(o => o.OrderItems).ThenInclude(oi => oi.Product).ThenInclude(p => p!.Place)
                .Include(o => o.BuyerUser).Include(o => o.SellerUser)
                .Include(o => o.DeliveryUser).Include(o => o.BrokerUser)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

        public async Task<decimal> GetTotalSalesBySellerAsync(Guid sellerId, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _context.Orders.Where(o => o.SellerUserId == sellerId && o.Status == "Completed");

            if (fromDate.HasValue) query = query.Where(o => o.CreatedAt >= fromDate.Value);
            if (toDate.HasValue) query = query.Where(o => o.CreatedAt <= toDate.Value);

            return await query.SumAsync(o => o.TotalAmount);
        }
    }
}