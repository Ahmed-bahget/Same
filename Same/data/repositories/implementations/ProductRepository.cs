using Microsoft.EntityFrameworkCore;
using Same.Data.Repositories.Interfaces;
using Same.Models.Entities;

namespace Same.Data.Repositories.Implementations
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Product>> GetByPlaceAsync(Guid placeId) =>
            await _context.Products.Where(p => p.PlaceId == placeId && p.IsAvailable)
                .Include(p => p.Place).Include(p => p.Seller).ToListAsync();

        public async Task<IEnumerable<Product>> GetBySellerAsync(Guid sellerId) =>
            await _context.Products.Where(p => p.SellerId == sellerId)
                .Include(p => p.Place).OrderByDescending(p => p.CreatedAt).ToListAsync();

        public async Task<IEnumerable<Product>> GetByCategoryAsync(string category) =>
            await _context.Products.Where(p => p.Category == category && p.IsAvailable)
                .Include(p => p.Place).Include(p => p.Seller).ToListAsync();

        public async Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm, int skip = 0, int take = 20) =>
            await _context.Products.Where(p => p.IsAvailable && 
                (p.Name.Contains(searchTerm) || p.Description!.Contains(searchTerm) || p.Category!.Contains(searchTerm)))
                .Include(p => p.Place).Include(p => p.Seller)
                .OrderByDescending(p => p.ViewCount).Skip(skip).Take(take).ToListAsync();

        public async Task<IEnumerable<Product>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice) =>
            await _context.Products.Where(p => p.IsAvailable && p.Price >= minPrice && p.Price <= maxPrice)
                .Include(p => p.Place).Include(p => p.Seller).ToListAsync();

        public async Task<IEnumerable<Product>> GetAvailableProductsAsync() =>
            await _context.Products.Where(p => p.IsAvailable && p.Stock > 0)
                .Include(p => p.Place).Include(p => p.Seller).ToListAsync();

        public async Task<IEnumerable<Product>> GetPopularProductsAsync(int take = 10) =>
            await _context.Products.Where(p => p.IsAvailable)
                .OrderByDescending(p => p.SalesCount).ThenByDescending(p => p.ViewCount)
                .Take(take).Include(p => p.Place).Include(p => p.Seller).ToListAsync();

        public async Task IncrementViewCountAsync(Guid productId)
        {
            var product = await GetByIdAsync(productId);
            if (product != null)
            {
                product.ViewCount++;
                product.UpdatedAt = DateTime.UtcNow;
                Update(product);
                await SaveChangesAsync();
            }
        }

        public async Task UpdateStockAsync(Guid productId, int newStock)
        {
            var product = await GetByIdAsync(productId);
            if (product != null)
            {
                product.Stock = newStock;
                product.UpdatedAt = DateTime.UtcNow;
                Update(product);
                await SaveChangesAsync();
            }
        }
    }
}