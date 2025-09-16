// ============ Program.cs ============

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Same.Data;
using Same.Services.Interfaces;
using Same.Services.Implementations;
using Same.Hubs;
using Same.Utils.Extensions;
using Same.Middleware;
using Same.Models.Entities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// CORS
builder.Services.AddCustomCors();

// Swagger/OpenAPI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Social Hobby Platform API", 
        Version = "v1",
        Description = "API for connecting people with same hobbies"
    });
    
    // JWT Authentication in Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// SignalR for real-time features
builder.Services.AddSignalR();

// Register Repositories
builder.Services.AddRepositories();

// Register Business Services
builder.Services.AddBusinessServices();

// Add Health Checks
builder.Services.AddCustomHealthChecks(builder.Configuration.GetConnectionString("DefaultConnection")!);

// Add Memory Cache
builder.Services.AddMemoryCache();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Social Hobby Platform API v1");
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Add custom middleware
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<LocationMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

// SignalR Hubs
app.MapHub<ChatHub>("/chatHub");
app.MapHub<NotificationHub>("/notificationHub");

// Seed Data Method
async Task SeedData(ApplicationDbContext context)
{
    // Check if we already have data
    if (await context.Users.AnyAsync())
    {
        return; // Database already has data
    }

    // Create sample hobbies
    var hobbies = new[]
    {
        new Same.Models.Entities.Hobby { HobbyId = Guid.NewGuid(), Name = "Basketball", Type = "Sports", Description = "Basketball games and tournaments", IsActive = true },
        new Same.Models.Entities.Hobby { HobbyId = Guid.NewGuid(), Name = "Photography", Type = "Arts", Description = "Photography workshops and meetups", IsActive = true },
        new Same.Models.Entities.Hobby { HobbyId = Guid.NewGuid(), Name = "Cooking", Type = "Food", Description = "Cooking classes and food events", IsActive = true },
        new Same.Models.Entities.Hobby { HobbyId = Guid.NewGuid(), Name = "Gaming", Type = "Tech", Description = "Gaming tournaments and LAN parties", IsActive = true }
    };

    context.Hobbies.AddRange(hobbies);
    await context.SaveChangesAsync();

    // Create sample places
    var places = new[]
    {
        new Same.Models.Entities.Place 
        { 
            PlaceId = Guid.NewGuid(), 
            Name = "Central Park Basketball Court", 
            PlaceType = "Sports Venue", 
            Category = "Sports",
            Address = "Central Park, New York, NY",
            Latitude = 40.7829M,
            Longitude = -73.9654M,
            IsActive = true
        },
        new Same.Models.Entities.Place 
        { 
            PlaceId = Guid.NewGuid(), 
            Name = "Downtown Photography Studio", 
            PlaceType = "Studio", 
            Category = "Arts",
            Address = "123 Main St, New York, NY",
            Latitude = 40.7589M,
            Longitude = -73.9851M,
            IsActive = true
        }
    };

    context.Places.AddRange(places);
    await context.SaveChangesAsync();

    // Create sample events
    var events = new[]
    {
        new Same.Models.Entities.Event
        {
            EventId = Guid.NewGuid(),
            Title = "Weekend Basketball Tournament",
            Description = "Join us for an exciting basketball tournament this weekend!",
            StartDateTime = DateTime.UtcNow.AddDays(2),
            EndDateTime = DateTime.UtcNow.AddDays(2).AddHours(4),
            HobbyId = hobbies[0].HobbyId,
            PlaceId = places[0].PlaceId,
            MaxParticipants = 20,
            IsPublic = true,
            Status = "Upcoming",
            CreatedAt = DateTime.UtcNow
        },
        new Same.Models.Entities.Event
        {
            EventId = Guid.NewGuid(),
            Title = "Photography Workshop",
            Description = "Learn professional photography techniques from experts",
            StartDateTime = DateTime.UtcNow.AddDays(5),
            EndDateTime = DateTime.UtcNow.AddDays(5).AddHours(3),
            HobbyId = hobbies[1].HobbyId,
            PlaceId = places[1].PlaceId,
            MaxParticipants = 15,
            IsPublic = true,
            Status = "Upcoming",
            CreatedAt = DateTime.UtcNow
        }
    };

    context.Events.AddRange(events);
    await context.SaveChangesAsync();

    // Create sample places
    var samplePlaces = new[]
    {
        new Same.Models.Entities.Place
        {
            PlaceId = Guid.NewGuid(),
            Name = "Central Park Basketball Court",
            Description = "Professional basketball court in Central Park with lighting for evening games",
            PlaceType = "Sports Venue",
            Category = "Sports",
            Address = "Central Park, New York, NY",
            Latitude = 40.7829M,
            Longitude = -73.9654M,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        },
        new Same.Models.Entities.Place
        {
            PlaceId = Guid.NewGuid(),
            Name = "Downtown Photography Studio",
            Description = "Modern photography studio with professional lighting and equipment",
            PlaceType = "Studio",
            Category = "Arts",
            Address = "123 Main St, New York, NY",
            Latitude = 40.7589M,
            Longitude = -73.9851M,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        },
        new Same.Models.Entities.Place
        {
            PlaceId = Guid.NewGuid(),
            Name = "Gaming Lounge",
            Description = "High-end gaming lounge with latest consoles and PCs",
            PlaceType = "Entertainment",
            Category = "Gaming",
            Address = "456 Tech Ave, New York, NY",
            Latitude = 40.7505M,
            Longitude = -73.9934M,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        }
    };

    context.Places.AddRange(samplePlaces);
    await context.SaveChangesAsync();
}

// Initialize Database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await context.Database.EnsureCreatedAsync();
    await SeedData(context);
}

app.Run();
