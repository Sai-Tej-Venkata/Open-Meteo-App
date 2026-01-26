using System.Text.Json.Serialization;
using Weather_App.Interfaces;

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

        public async Task<T?> GetAsync<T>(string url)
        {
            try
            {
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                return System.Text.Json.JsonSerializer.Deserialize<T>(content, new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
                });
            }
            catch (HttpRequestException ex)
            {
                throw new InvalidOperationException($"Failed to fetch data from {url}", ex);
            }
        }

        public async Task<string> GetStringAsync(string url)
        {
            try
            {
                return await _httpClient.GetStringAsync(url);
            }
            catch (HttpRequestException ex)
            {
                throw new InvalidOperationException($"Failed to fetch data from {url}", ex);
            }
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
                return await GetAsync<HistoricalWeatherResponse>(url);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to fetch historical weather data from Open-Meteo API", ex);
            }
        }
    }

    public class HistoricalWeatherResponse
    {
        [JsonPropertyName("latitude")]
        public double Latitude { get; set; }

        [JsonPropertyName("longitude")]
        public double Longitude { get; set; }

        [JsonPropertyName("generationtime_ms")]
        public double GenerationtimeMs { get; set; }

        [JsonPropertyName("timezone")]
        public string? Timezone { get; set; }

        [JsonPropertyName("daily")]
        public DailyData? Daily { get; set; }

        [JsonPropertyName("hourly")]
        public HourlyData? Hourly { get; set; }
    }

    public class DailyData
    {
        [JsonPropertyName("time")]
        public List<string>? Time { get; set; }

        [JsonPropertyName("temperature_2m_max")]
        public List<double>? TemperatureMax { get; set; }

        [JsonPropertyName("temperature_2m_min")]
        public List<double>? TemperatureMin { get; set; }

        [JsonPropertyName("precipitation")]
        public List<double>? Precipitation { get; set; }

        [JsonPropertyName("weather_code")]
        public List<int>? WeatherCode { get; set; }
    }

    public class HourlyData
    {
        [JsonPropertyName("time")]
        public List<string>? Time { get; set; }

        [JsonPropertyName("temperature_2m")]
        public List<double>? Temperature { get; set; }

        [JsonPropertyName("precipitation")]
        public List<double>? Precipitation { get; set; }
    }
}
