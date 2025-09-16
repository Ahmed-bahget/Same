using Same.Models.Entities;

namespace Same.Data.Repositories.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<IEnumerable<Product>> GetByPlaceAsync(Guid placeId);
        Task<IEnumerable<Product>> GetBySellerAsync(Guid sellerId);
        Task<IEnumerable<Product>> GetByCategoryAsync(string category);
        Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm, int skip = 0, int take = 20);
        Task<IEnumerable<Product>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice);
        Task<IEnumerable<Product>> GetAvailableProductsAsync();
        Task<IEnumerable<Product>> GetPopularProductsAsync(int take = 10);
        Task IncrementViewCountAsync(Guid productId);
        Task UpdateStockAsync(Guid productId, int newStock);
    }
}