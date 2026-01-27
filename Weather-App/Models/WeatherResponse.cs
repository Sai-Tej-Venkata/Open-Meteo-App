using System.Text.Json.Serialization;

namespace Weather_App.Models
{
    public class WeatherResponse
    {
        [JsonPropertyName("weatherDataList")]
        public List<HistoricalWeatherResponse> WeatherDataList { get; set; }

        [JsonPropertyName("errorsHash")]
        public Dictionary<string, string> ErrorsHash { get; set; }

        public WeatherResponse(Dictionary<string, string> errorsHash)
        {
            WeatherDataList = new();
            ErrorsHash = errorsHash;
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

    public class OtherInputData
    {
        [JsonPropertyName("daily")]
        public string? Daily { get; set; }

        [JsonPropertyName("timezone")]
        public string? Timezone { get; set; }
    }
}
