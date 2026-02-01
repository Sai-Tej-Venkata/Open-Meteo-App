using Weather_App.Models;

namespace Weather_App.Interfaces
{
    public interface IOpenMeteoClientService
    {
        Task<WeatherResponse> GetWeatherAsync(
            double latitude,
            double longitude,
            string startDate = null,
            string endDate = null,
            string daily = null,
            string hourly = null,
            string timezone = "auto");
    }
}
