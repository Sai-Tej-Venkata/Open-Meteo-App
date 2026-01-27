using Weather_App.Models;
using Weather_App.Services;

namespace Weather_App.Interfaces
{
    public interface IOpenMeteoClientService
    {
        Task<WeatherResponse> GetWeatherAsync(
            double latitude,
            double longitude,
            string? startDate,
            string? endDate,
            string? daily = null,
            string? hourly = null,
            string? timezone = "auto");
    }
}
