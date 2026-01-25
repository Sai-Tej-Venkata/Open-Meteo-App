using Weather_API.Interfaces;

namespace Weather_API.Services
{
    public class OpenMeteoClientService : IOpenMeteoClientService
    {
        private readonly IHttpService _httpService;
        public OpenMeteoClientService(IHttpService httpService)
        {
            _httpService = httpService;
        }

        public async Task<HistoricalWeatherResponse?> GetWeatherAsync(
            double latitude,
            double longitude,
            string startDate,
            string endDate,
            string? daily = null,
            string? hourly = null,
            string? timezone = "auto")
        {
            var val = await _httpService.GetHistoricalWeatherAsync(latitude, 
                                                                    longitude, 
                                                                    startDate, 
                                                                    endDate, 
                                                                    daily, 
                                                                    hourly, 
                                                                    timezone);
            return val;
        }
    }
}
