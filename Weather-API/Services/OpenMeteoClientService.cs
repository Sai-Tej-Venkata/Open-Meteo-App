using System.Text.Json;
using System.Text.Json.Serialization;
using Weather_API.Interfaces;

namespace Weather_API.Services
{
    public class OpenMeteoClientService : IOpenMeteoClientService
    {
        private readonly IHttpService _httpService;
        private readonly IWebHostEnvironment _env;

        public OpenMeteoClientService(IHttpService httpService, IWebHostEnvironment env)
        {
            _httpService = httpService;
            _env = env;
        }

        public async Task<List<HistoricalWeatherResponse?>> GetWeatherAsync(
            double latitude,
            double longitude,
            string startDate,
            string endDate,
            string? daily = null,
            string? hourly = null,
            string? timezone = "auto")
        {
            // Read latitude, longitude, daily, and timezone from inputs.json
            var inputs = ReadInputsFromFile();

            var results = new List<HistoricalWeatherResponse?>();
            var dates = ReadDatesFromFile();

            foreach (var dateRange in dates)
            {
                var val = await _httpService.GetHistoricalWeatherAsync(
                    inputs.Latitude,
                    inputs.Longitude,
                    dateRange.Start,
                    dateRange.End,
                    inputs.Daily,
                    hourly,
                    inputs.Timezone);
                
                // Save the JSON response to a file
                if (val != null)
                {
                    SaveWeatherDataToFile(val, dateRange.Start);
                }
                
                results.Add(val);
            }

            return results;
        }

        private List<(string Start, string End)> ReadDatesFromFile()
        {
            List<string> errors = new List<string>();
            var results = new List<(string Start, string End)>();

            var filePath = Path.Combine(_env.ContentRootPath, @"Files\weather-inputs", "dates.txt");
            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"Dates file not found at {filePath}");
            }

            var lines = File.ReadAllLines(filePath)
                            .Where(line => !string.IsNullOrWhiteSpace(line))
                            .ToList();

            if (lines.Count == 0)
            {
                throw new InvalidOperationException("No dates found in the dates.txt file");
            }

            var parsedDates = new List<DateTime>();

            foreach (var line in lines)
            {
                if (DateTime.TryParse(line, out var date))
                {
                    parsedDates.Add(date);
                }
                else
                {
                    errors.Add($"Invalid date format: {line}");
                    // TEJ: Commented below is the Copilot generated exception-throw
                    //throw new FormatException($"Unable to parse date: {line}. Please use a valid date format.");
                }
            }

            // TEJ: Commented below is the Copilot generated dates-sort.
            // parsedDates.Sort();

            for (int i = 0; i < parsedDates.Count; i += 1)
            {
                string start = parsedDates[i].ToString("yyyy-MM-dd");
                string end = start;

                results.Add((start, end));
            }

            return results;
        }

        private InputData ReadInputsFromFile()
        {
            var filePath = Path.Combine(_env.ContentRootPath, @"Files\weather-inputs", "other-inputs.json");

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"Inputs file not found at {filePath}");
            }

            var jsonContent = File.ReadAllText(filePath);

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };

            var inputs = JsonSerializer.Deserialize<InputData>(jsonContent, options);

            if (inputs == null)
            {
                throw new InvalidOperationException("Failed to deserialize inputs.json file");
            }

            return inputs;
        }

        private void SaveWeatherDataToFile(HistoricalWeatherResponse response, string startDate)
        {
            try
            {
                // Create the weather-data folder if it doesn't exist
                var weatherDataFolder = Path.Combine(_env.ContentRootPath, @"Files\weather-data");
                if (!Directory.Exists(weatherDataFolder))
                {
                    Directory.CreateDirectory(weatherDataFolder);
                }

                // Create filename using the start date
                var fileName = $"{startDate}.json";
                var filePath = Path.Combine(weatherDataFolder, fileName);

                // Check if file exists and has content
                if (File.Exists(filePath) && new FileInfo(filePath).Length > 0)
                {
                    // File exists and is not empty, skip saving
                    return;
                }

                // Serialize the response to JSON
                var options = new JsonSerializerOptions
                {
                    WriteIndented = true,
                    // TEJ: Changed Copilot-generated JsonIgnoreCondition.WhenWritingNull to Never.
                    DefaultIgnoreCondition = JsonIgnoreCondition.Never
                };

                var jsonContent = JsonSerializer.Serialize(response, options);

                // Write the JSON to the file
                File.WriteAllText(filePath, jsonContent);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to save weather data to file for date {startDate}", ex);
            }
        }
    }

    public class InputData
    {
        [JsonPropertyName("latitude")]
        public double Latitude { get; set; }

        [JsonPropertyName("longitude")]
        public double Longitude { get; set; }

        [JsonPropertyName("daily")]
        public string? Daily { get; set; }

        [JsonPropertyName("timezone")]
        public string? Timezone { get; set; }
    }
}
