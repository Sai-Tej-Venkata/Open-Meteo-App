using Weather_App.Models;
using Weather_App.Services;

namespace Weather_App.Interfaces
{
    public interface IHttpService
    {
        Task<HistoricalWeatherResponse> GetHistoricalWeatherAsync(
            double latitude,
            double longitude,
            string startDate = null,
            string endDate = null,
            string daily = null,
            string hourly = null,
            string timezone = null);
    }
}
