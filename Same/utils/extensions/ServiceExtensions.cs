using Same.Data;
using Same.Data.Repositories.Interfaces;
using Same.Data.Repositories.Implementations;
using Same.Services.Interfaces;
using Same.Services.Implementations;

namespace Same.Utils.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            // Register generic repository
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            
            // Register specific repositories
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IPlaceRepository, PlaceRepository>();
            services.AddScoped<IHobbyRepository, HobbyRepository>();
            services.AddScoped<IEventRepository, EventRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IChatRepository, ChatRepository>();

            return services;
        }

        public static IServiceCollection AddBusinessServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IPlaceService, PlaceService>();
            services.AddScoped<IHobbyService, HobbyService>();
            services.AddScoped<IEventService, EventService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IChatService, ChatService>();
            services.AddScoped<IReviewService, ReviewService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<ILocationService, LocationService>();

            return services;
        }

        public static IServiceCollection AddCustomCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });

                options.AddPolicy("Production", policy =>
                {
                    policy.WithOrigins("https://yourdomain.com", "https://www.yourdomain.com")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                });
            });

            return services;
        }

        public static IServiceCollection AddCustomHealthChecks(this IServiceCollection services, string connectionString)
        {
            services.AddHealthChecks()
                .AddDbContextCheck<ApplicationDbContext>()
                .AddCheck("API", () => Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy("API is running"));

            return services;
        }
    }
}