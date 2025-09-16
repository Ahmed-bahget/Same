using System.Security.Cryptography;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Same.Data;
using Same.Services.Interfaces;
using Same.Models.Entities;
using Same.Models.DTOs.Requests.Auth;
using Same.Models.DTOs.Responses;

namespace Same.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                    return ApiResponse<AuthResponse>.ErrorResult("Email already registered");

                if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                    return ApiResponse<AuthResponse>.ErrorResult("Username already taken");

                var user = new User
                {
                    Username = request.Username,
                    Email = request.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    PhoneNumber = request.PhoneNumber,
                    DateOfBirth = request.DateOfBirth,
                    ProfileImageUrl = request.ProfileImageUrl
                };

                _context.Users.Add(user);
                
                if (request.HobbyIds?.Any() == true)
                {
                    foreach (var hobbyId in request.HobbyIds)
                    {
                        if (await _context.Hobbies.AnyAsync(h => h.HobbyId == hobbyId))
                        {
                            _context.UserHobbies.Add(new UserHobby
                            {
                                UserId = user.UserId,
                                HobbyId = hobbyId
                            });
                        }
                    }
                }

                await _context.SaveChangesAsync();

                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();

                user.LastLoginAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var userResponse = new UserResponse
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    FullName = $"{user.FirstName} {user.LastName}".Trim(),
                    ProfileImageUrl = user.ProfileImageUrl,
                    CoverImageUrl = user.CoverImageUrl,
                    Bio = user.Bio,
                    PhoneNumber = user.PhoneNumber,
                    DateOfBirth = user.DateOfBirth,
                    Age = user.DateOfBirth.HasValue ? DateTime.UtcNow.Year - user.DateOfBirth.Value.Year : 0,
                    CurrentLatitude = (double?)user.CurrentLatitude,
                    CurrentLongitude = (double?)user.CurrentLongitude,
                    LocationAddress = user.LocationAddress,
                    LocationPrivacy = user.LocationPrivacy,
                    LocationUpdatedAt = user.LocationUpdatedAt,
                    IsActive = user.IsActive,
                    IsVerified = user.IsVerified,
                    JoinDate = user.JoinDate,
                    LastLoginAt = user.LastLoginAt,
                    Hobbies = new List<HobbyResponse>()
                };

                return ApiResponse<AuthResponse>.SuccessResult(new AuthResponse
                {
                    Token = token,
                    ExpiresAt = DateTime.UtcNow.AddDays(30),
                    User = userResponse,
                    RefreshToken = refreshToken
                });
            }
            catch (Exception ex)
            {
                return ApiResponse<AuthResponse>.ErrorResult($"Registration failed: {ex.Message}");
            }
        }

        public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.UserHobbies)
                        .ThenInclude(uh => uh.Hobby)
                    .FirstOrDefaultAsync(u => 
                        u.Email == request.EmailOrUsername || 
                        u.Username == request.EmailOrUsername);

                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                    return ApiResponse<AuthResponse>.ErrorResult("Invalid credentials");

                if (!user.IsActive)
                    return ApiResponse<AuthResponse>.ErrorResult("Account is deactivated");

                user.LastLoginAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();

                var userResponse = new UserResponse
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    FullName = $"{user.FirstName} {user.LastName}".Trim(),
                    ProfileImageUrl = user.ProfileImageUrl,
                    CoverImageUrl = user.CoverImageUrl,
                    Bio = user.Bio,
                    PhoneNumber = user.PhoneNumber,
                    DateOfBirth = user.DateOfBirth,
                    Age = user.DateOfBirth.HasValue ? DateTime.UtcNow.Year - user.DateOfBirth.Value.Year : 0,
                    CurrentLatitude = (double?)user.CurrentLatitude,
                    CurrentLongitude = (double?)user.CurrentLongitude,
                    LocationAddress = user.LocationAddress,
                    LocationPrivacy = user.LocationPrivacy,
                    LocationUpdatedAt = user.LocationUpdatedAt,
                    IsActive = user.IsActive,
                    IsVerified = user.IsVerified,
                    JoinDate = user.JoinDate,
                    LastLoginAt = user.LastLoginAt,
                    Hobbies = user.UserHobbies?.Select(uh => new HobbyResponse
                    {
                        HobbyId = uh.Hobby.HobbyId,
                        Name = uh.Hobby.Name,
                        Type = uh.Hobby.Type,
                        Description = uh.Hobby.Description
                    }).ToList() ?? new List<HobbyResponse>()
                };

                return ApiResponse<AuthResponse>.SuccessResult(new AuthResponse
                {
                    Token = token,
                    ExpiresAt = DateTime.UtcNow.AddDays(30),
                    User = userResponse,
                    RefreshToken = refreshToken
                });
            }
            catch (Exception ex)
            {
                return ApiResponse<AuthResponse>.ErrorResult($"Login failed: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> RefreshTokenAsync(string refreshToken)
        {
            await Task.CompletedTask;
            return ApiResponse<string>.ErrorResult("Not implemented");
        }

        public async Task<ApiResponse<bool>> LogoutAsync(Guid userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    await _context.SaveChangesAsync();
                }
                return ApiResponse<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResult($"Logout failed: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> VerifyEmailAsync(string token)
        {
            await Task.CompletedTask;
            return ApiResponse<bool>.ErrorResult("Not implemented");
        }

        public async Task<ApiResponse<bool>> ForgotPasswordAsync(string email)
        {
            await Task.CompletedTask;
            return ApiResponse<bool>.ErrorResult("Not implemented");
        }

        public async Task<ApiResponse<bool>> ResetPasswordAsync(string token, string newPassword)
        {
            await Task.CompletedTask;
            return ApiResponse<bool>.ErrorResult("Not implemented");
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("FirstName", user.FirstName ?? ""),
                new Claim("LastName", user.LastName ?? "")
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(30),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}