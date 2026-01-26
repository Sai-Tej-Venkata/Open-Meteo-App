using Microsoft.AspNetCore.Mvc;
using Weather_App.Interfaces;
using Weather_App.Services;

namespace Weather_App.Controllers
{
    [ApiController]
    [Route("api/v1/weather")]
    public class OpenMeteoClientController : ControllerBase
    {
        private readonly IOpenMeteoClientService _service;

        public OpenMeteoClientController(IOpenMeteoClientService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<List<HistoricalWeatherResponse?>> GetWeather(
            double latitude,
            double longitude,
            string? startDate = "",
            string? endDate = "",
            string? daily = null,
            string? hourly = null,
            string? timeZone = "auto")
        {
            return await _service.GetWeatherAsync(latitude, longitude, startDate, endDate, daily, hourly, timeZone);
        }
    }
}
