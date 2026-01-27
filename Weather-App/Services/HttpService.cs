using System.Text.Json;
using System.Text.Json.Serialization;
using Weather_App.Interfaces;
using Weather_App.Models;

namespace Weather_App.Services
{
    public class HttpService : IHttpService
    {
        private readonly HttpClient _httpClient;
        private const string OpenMeteoBaseUrl = "https://open-meteo.com";

        public HttpService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri(OpenMeteoBaseUrl);
        }

        public async Task<HistoricalWeatherResponse?> GetHistoricalWeatherAsync(
            double latitude,
            double longitude,
            string? startDate,
            string? endDate,
            string? daily = null,
            string? hourly = null,
            string? timezone = null)
        {
            try
            {
                var queryParams = new List<string>
                {
                    $"latitude={latitude}",
                    $"longitude={longitude}",
                    $"start_date={startDate}",
                    $"end_date={endDate}",
                    $"timezone={timezone}"
                };

                 if (!string.IsNullOrEmpty(daily))
                {
                    queryParams.Add($"daily={daily.Replace(" ", "")}");
                }

                if (!string.IsNullOrEmpty(hourly))
                {
                    queryParams.Add($"hourly={hourly}");
                }

                var url = $"https://archive-api.open-meteo.com/v1/archive?{string.Join("&", queryParams)}";
                //return await GetAsync<HistoricalWeatherResponse>(url);

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<HistoricalWeatherResponse>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
                });
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to fetch historical weather data from Open-Meteo API", ex);
            }
        }
    }
}
