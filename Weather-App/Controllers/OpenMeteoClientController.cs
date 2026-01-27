using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Weather_App.Interfaces;
using Weather_App.Models;
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
        public async Task<WeatherResponse> GetWeather(
            double latitude,
            double longitude,
            string? startDate = "",
            string? endDate = "",
            string? daily = null,
            string? hourly = null,
            string? timeZone = "auto")
        {
            var response = await _service.GetWeatherAsync(latitude, longitude, startDate, endDate, daily, hourly, timeZone);
            return response;
        }
    }
}
