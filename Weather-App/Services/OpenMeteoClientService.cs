using System.Text.Json;
using System.Text.Json.Serialization;
using Weather_App.Interfaces;
using Weather_App.Models;

namespace Weather_App.Services
{
    public class OpenMeteoClientService : IOpenMeteoClientService
    {
        private readonly IHttpService _httpService;
        private readonly IWebHostEnvironment _env;
        private readonly Dictionary<string, string> _errorsHash;

        public OpenMeteoClientService(IHttpService httpService, IWebHostEnvironment env)
        {
            _httpService = httpService;
            _env = env;

            _errorsHash = new();
            _errorsHash[Constants.Common] = string.Empty;
        }

        public async Task<WeatherResponse> GetWeatherAsync(
            double latitude,
            double longitude,
            string? startDate,
            string? endDate,
            string? daily = null,
            string? hourly = null,
            string? timezone = "auto")
        {
            var weatherResponse = new WeatherResponse(_errorsHash);

            // Read latitude, longitude, daily, and timezone from inputs.json
            var dates = ReadDatesFromFile();
            var inputs = ReadOtherInputsFromFile();

            foreach (var dateRange in dates)
            {
                var val = await _httpService.GetHistoricalWeatherAsync(
                                                latitude,
                                                longitude,
                                                dateRange.Start,
                                                dateRange.End,
                                                inputs.Daily,
                                                hourly,
                                                inputs.Timezone);

                // Save the JSON response to a file
                if (val != null)
                {
                    SaveWeatherDataToFile(val, dateRange.Start);
                    weatherResponse.WeatherDataList.Add(val);
                }
            }
            SaveWeatherErrorsToFile(weatherResponse.ErrorsHash);

            return weatherResponse;
        }

        private List<(string Start, string End)> ReadDatesFromFile()
        {
            var results = new List<(string Start, string End)>();

            var fileName = "dates.txt";
            var filePath = Path.Combine(_env.ContentRootPath, @"Files\weather-inputs", fileName);
            if (!File.Exists(filePath))
            {
                _errorsHash[Constants.Common] += $"File {fileName} is not found at {filePath}. ";
                return results;
            }

            var lines = File.ReadAllLines(filePath)
                            .Where(line => !string.IsNullOrWhiteSpace(line))
                            .ToList();
            if (lines.Count == 0)
            {
                _errorsHash[Constants.Common] += "No dates found in the {dates.txt} file. ";
                return results;
            }

            var parsedDates = new List<DateTime>();

            foreach (var dateLine in lines)
            {
                if (DateTime.TryParse(dateLine, out var date))
                {
                    parsedDates.Add(date);
                }
                else
                {
                    _errorsHash[dateLine] = $"{dateLine} is an invalid date";
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

        private OtherInputData ReadOtherInputsFromFile()
        {
            var fileName = "other-inputs.json";
            var filePath = Path.Combine(_env.ContentRootPath, @"Files\weather-inputs", fileName);

            if (!File.Exists(filePath))
            {
                _errorsHash[Constants.Common] += $"File {fileName} is not found at {filePath}. ";
                return new OtherInputData();
            }

            var jsonContent = File.ReadAllText(filePath);

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };

            var inputs = JsonSerializer.Deserialize<OtherInputData>(jsonContent, options);
            if (inputs == null)
            {
                _errorsHash[Constants.Common] += $"Failed to deserialize {fileName} file. ";
                return new OtherInputData();
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
                _errorsHash[Constants.Common] += $"Failed to save weather-data to file for the date {startDate} - {ex.Message}. ";
            }
        }

        private void SaveWeatherErrorsToFile(Dictionary<string, string> errorsHash)
        {
            try
            {
                // Create the weather-data folder if it doesn't exist
                var weatherDataFolder = Path.Combine(_env.ContentRootPath, @"Files\weather-data");
                if (!Directory.Exists(weatherDataFolder))
                {
                    Directory.CreateDirectory(weatherDataFolder);
                }

                foreach (var error in errorsHash)
                {
                    if (string.IsNullOrWhiteSpace(error.Key) || string.IsNullOrWhiteSpace(error.Value))
                    {
                        continue;
                    }

                    // Create filename using the start date
                    var fileName = $"{error.Key}.json";
                    var filePath = Path.Combine(weatherDataFolder, fileName);

                    try
                    {
                        // Write the JSON to the file
                        File.WriteAllText(filePath, error.Value);
                    }
                    catch (Exception ex)
                    {
                        _errorsHash[Constants.Common] += $"Failed to save weather-errors to file {fileName} - {ex.Message}. ";
                    }
                }
            }
            catch (Exception ex)
            {
                _errorsHash[Constants.Common] += $"Failed to access/save weather-errors folder - {ex.Message}. ";
            }
        }
    }
}
