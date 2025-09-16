using System.Text.RegularExpressions;

namespace Same.Utils.Helpers
{
    public static class ValidationHelper
    {
        private static readonly Regex EmailRegex = new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled);
        private static readonly Regex UsernameRegex = new(@"^[a-zA-Z0-9_]{3,30}$", RegexOptions.Compiled);
        private static readonly Regex PhoneRegex = new(@"^\+?[\d\s\-\(\)]{8,20}$", RegexOptions.Compiled);

        public static bool IsValidEmail(string? email)
        {
            return !string.IsNullOrEmpty(email) && EmailRegex.IsMatch(email);
        }

        public static bool IsValidUsername(string? username)
        {
            return !string.IsNullOrEmpty(username) && UsernameRegex.IsMatch(username);
        }

        public static bool IsValidPhoneNumber(string? phone)
        {
            return !string.IsNullOrEmpty(phone) && PhoneRegex.IsMatch(phone);
        }

        public static bool IsValidPassword(string? password)
        {
            if (string.IsNullOrEmpty(password) || password.Length < 6)
                return false;

            // At least one uppercase, one lowercase, one digit
            return password.Any(char.IsUpper) &&
                   password.Any(char.IsLower) &&
                   password.Any(char.IsDigit);
        }

        public static bool IsValidCoordinate(decimal? latitude, decimal? longitude)
        {
            return latitude.HasValue && longitude.HasValue &&
                   latitude >= -90 && latitude <= 90 &&
                   longitude >= -180 && longitude <= 180;
        }

        public static bool IsValidUrl(string? url)
        {
            return Uri.TryCreate(url, UriKind.Absolute, out var result) &&
                   (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
        }

        public static bool IsValidRating(int rating)
        {
            return rating >= 1 && rating <= 5;
        }

        public static bool IsValidPrice(decimal price)
        {
            return price >= 0 && price <= 1_000_000_000; // Max 1 billion
        }

        public static bool IsValidQuantity(int quantity)
        {
            return quantity > 0 && quantity <= 10000;
        }

        public static bool IsValidGuid(string? guidString)
        {
            return Guid.TryParse(guidString, out _);
        }

        public static bool IsValidDateRange(DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue || !endDate.HasValue)
                return true; // Optional dates are valid

            return startDate.Value <= endDate.Value;
        }

        public static bool IsValidAge(DateTime? dateOfBirth)
        {
            if (!dateOfBirth.HasValue)
                return true; // Optional date of birth

            var age = DateTime.Now.Year - dateOfBirth.Value.Year;
            if (DateTime.Now.DayOfYear < dateOfBirth.Value.DayOfYear)
                age--;

            return age >= 13 && age <= 120; // Reasonable age range
        }
    }
}