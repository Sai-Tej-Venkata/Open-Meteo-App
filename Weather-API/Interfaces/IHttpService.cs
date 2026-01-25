using Weather_API.Services;

namespace Weather_API.Interfaces
{
    public interface IHttpService
    {
        Task<T?> GetAsync<T>(string url);
        Task<string> GetStringAsync(string url);
        Task<HistoricalWeatherResponse?> GetHistoricalWeatherAsync(
            double latitude,
            double longitude,
            string startDate,
            string endDate,
            string? daily = null,
            string? hourly = null,
            string? timezone = "auto");
    }
}
