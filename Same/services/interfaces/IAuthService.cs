using Same.Models.DTOs.Requests.Auth;
using Same.Models.DTOs.Requests.User;
using Same.Models.DTOs.Responses;
using Same.Models.Entities;

namespace Same.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request);
        Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request);
        Task<ApiResponse<string>> RefreshTokenAsync(string refreshToken);
        Task<ApiResponse<bool>> LogoutAsync(Guid userId);
        Task<ApiResponse<bool>> VerifyEmailAsync(string token);
        Task<ApiResponse<bool>> ForgotPasswordAsync(string email);
        Task<ApiResponse<bool>> ResetPasswordAsync(string token, string newPassword);
    }
}
