using Weather_API.Services;

namespace Weather_API.Interfaces
{
    public interface IOpenMeteoClientService
    {
        Task<List<HistoricalWeatherResponse?>> GetWeatherAsync(
            double latitude,
            double longitude,
            string startDate,
            string endDate,
            string? daily = null,
            string? hourly = null,
            string? timezone = "auto");
    }
}
