using System.ComponentModel.DataAnnotations;

namespace Same.Models.DTOs.Requests.User
{
    public class SearchUsersRequest
    {
        public string? Query { get; set; }
        public List<Guid>? HobbyIds { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public int? MaxDistance { get; set; } // km
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}