using Microsoft.AspNetCore.Mvc;
using Weather_API.Interfaces;
using Weather_API.Services;

namespace Weather_API.Controllers
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
            double latitude = 0d,
            double longitude = 0d,
            string startDate = "",
            string endDate = "",
            string daily = "",
            string timeZone = "")
        {
            return await _service.GetWeatherAsync(latitude, longitude, startDate, endDate, daily, timeZone);
        }
    }
}
