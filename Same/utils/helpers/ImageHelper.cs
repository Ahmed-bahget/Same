namespace Same.Utils.Helpers
{
    public static class ImageHelper
    {
        private static readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private static readonly long MaxImageSizeBytes = 5 * 1024 * 1024; // 5MB

        public static bool IsValidImageFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return false;

            if (file.Length > MaxImageSizeBytes)
                return false;

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            return AllowedImageExtensions.Contains(extension);
        }

        public static bool IsValidImageUrl(string? url)
        {
            if (string.IsNullOrEmpty(url))
                return false;

            if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
                return false;

            var extension = Path.GetExtension(uri.LocalPath).ToLowerInvariant();
            return AllowedImageExtensions.Contains(extension);
        }

        public static string GenerateUniqueFileName(string originalFileName)
        {
            var extension = Path.GetExtension(originalFileName);
            var fileName = Path.GetFileNameWithoutExtension(originalFileName);
            var uniqueId = Guid.NewGuid().ToString("N")[..8];
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            
            return $"{fileName}_{timestamp}_{uniqueId}{extension}";
        }

        public static string[] ParseImageUrls(string? imageUrlsJson)
        {
            if (string.IsNullOrEmpty(imageUrlsJson))
                return Array.Empty<string>();

            try
            {
                var urls = System.Text.Json.JsonSerializer.Deserialize<string[]>(imageUrlsJson);
                return urls?.Where(IsValidImageUrl).ToArray() ?? Array.Empty<string>();
            }
            catch
            {
                return Array.Empty<string>();
            }
        }

        public static string SerializeImageUrls(IEnumerable<string>? imageUrls)
        {
            if (imageUrls == null)
                return "[]";

            var validUrls = imageUrls.Where(IsValidImageUrl).ToArray();
            return System.Text.Json.JsonSerializer.Serialize(validUrls);
        }
    }
}