using Same.Models.DTOs.Responses;
using System.Net;
using System.Text.Json;

namespace Same.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var response = exception switch
            {
                UnauthorizedAccessException => new ApiResponse<object>
                {
                    Success = false,
                    Message = "Unauthorized access",
                    Data = null
                },
                ArgumentException argEx => new ApiResponse<object>
                {
                    Success = false,
                    Message = argEx.Message,
                    Data = null
                },
                KeyNotFoundException => new ApiResponse<object>
                {
                    Success = false,
                    Message = "Resource not found",
                    Data = null
                },
                _ => new ApiResponse<object>
                {
                    Success = false,
                    Message = "An internal server error occurred",
                    Data = null
                }
            };

            context.Response.StatusCode = exception switch
            {
                UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
                ArgumentException => (int)HttpStatusCode.BadRequest,
                KeyNotFoundException => (int)HttpStatusCode.NotFound,
                _ => (int)HttpStatusCode.InternalServerError
            };

            var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(jsonResponse);
        }
    }
}