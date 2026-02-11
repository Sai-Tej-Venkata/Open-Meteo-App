import { Component } from "react";
import PropTypes from "prop-types";
import GeoCoordinates from "./GeoCoordinates";
import { WeatherService } from "../services/WeatherService";

class WeatherDisplay extends Component {
  constructor(props) {
    super(props);
    this.weatherService = new WeatherService();
    this.state = {
      latitude: 32.78,
      longitude: 96.8,
      timezone: null,
      weatherData: null,
      isLoading: false,
      error: null,
    };
  }

  static WeatherDataIndex = {
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    timezone: PropTypes.string,
  };

  static WeatherDataItem = {
    date: PropTypes.string,
    temperatureMax: PropTypes.number,
    temperatureMin: PropTypes.number,
    precipitation: PropTypes.number,
  };

  static WeatherErrors = {
    date: PropTypes.string,
    error: PropTypes.string,
  };

  handleLatitudeChange = (latitude) => {
    this.setState({ latitude: parseFloat(latitude) });
  };

  handleLongitudeChange = (longitude) => {
    this.setState({ longitude: parseFloat(longitude) });
  };

  renderWeatherTableRows = () => {
    const { weatherData } = this.state;
    
    if (!weatherData) {
      return (
        <tr>
          <td colSpan="4" style={{ textAlign: "center" }}>No data fetched yet</td>
        </tr>
      );
    }

    // Check if data has weatherDataList (your API structure)
    if (weatherData.weatherDataList && Array.isArray(weatherData.weatherDataList)) {
      console.log("Using weatherDataList format");
      const weatherList = weatherData.weatherDataList;

      if (weatherList.length === 0) {
        return (
          <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>No weather data available</td>
          </tr>
        );
      }

      // Flatten all weather data into a single table
      const allRows = [];
      weatherList.forEach((weather) => {
        if (weather.daily && weather.daily.time && Array.isArray(weather.daily.time)) {
          const times = weather.daily.time;
          const tempMax = weather.daily.temperature_2m_max || [];
          const tempMin = weather.daily.temperature_2m_min || [];
          const precip = weather.daily.precipitation || [];

          times.forEach((date, index) => {
            allRows.push(
              <tr key={`${weather.latitude}-${date}-${index}`}>
                <td>{date}</td>
                <td>{tempMax[index] || "N/A"}</td>
                <td>{tempMin[index] || "N/A"}</td>
                <td>{precip && precip[index] ? precip[index] : "N/A"}</td>
              </tr>
            );
          });
        }
      });

      return allRows.length > 0 ? allRows : (
        <tr>
          <td colSpan="4" style={{ textAlign: "center" }}>No weather data available</td>
        </tr>
      );
    }

    // Check if data has daily object with time array (Open-Meteo format)
    if (weatherData.daily && weatherData.daily.time && Array.isArray(weatherData.daily.time)) {
      console.log("Using Open-Meteo format");
      const times = weatherData.daily.time;
      const tempMax = weatherData.daily.temperature_2m_max || [];
      const tempMin = weatherData.daily.temperature_2m_min || [];
      const precip = weatherData.daily.precipitation || [];

      if (times.length === 0) {
        return (
          <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>No weather data available</td>
          </tr>
        );
      }

      return times.map((date, index) => (
        <tr key={index}>
          <td>{date}</td>
          <td>{tempMax[index] || "N/A"}</td>
          <td>{tempMin[index] || "N/A"}</td>
          <td>{precip && precip[index] ? precip[index] : "N/A"}</td>
        </tr>
      ));
    }

    // Check if data is an array directly
    if (Array.isArray(weatherData)) {
      console.log("Using Array format");
      return weatherData.map((item, index) => (
        <tr key={index}>
          <td>{item.date || "N/A"}</td>
          <td>{item.temperatureMax || "N/A"}</td>
          <td>{item.temperatureMin || "N/A"}</td>
          <td>{item.precipitation || "N/A"}</td>
        </tr>
      ));
    }

    return (
      <tr>
        <td colSpan="4" style={{ textAlign: "center" }}>Unable to parse weather data</td>
      </tr>
    );
  };

  render() {
    return (
      <div>
        <h1 className="app-title">Weather App</h1>
        <div>
          <GeoCoordinates
            latitude={this.state.latitude}
            longitude={this.state.longitude}
            onLatitudeChange={this.handleLatitudeChange}
            onLongitudeChange={this.handleLongitudeChange}
          />
        </div>
        <div>
          <button onClick={this.fetchWeatherData}>Get Weather Data</button>
        </div>
        {this.state.isLoading && (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}
        {this.state.error && (
          <div className="error-container">
            <p style={{ color: "red" }}>Error: {this.state.error}</p>
          </div>
        )}
        {this.state.weatherData && (
          <div>
            <div className="app-section">
              <h2>Weather Data</h2>
            </div>

            <div className="weather-index">
              <label>Latitude:</label>
              {this.state.latitude}
            </div>

            <div className="weather-index">
              <label>Longitude:</label>
              {this.state.longitude}
            </div>

            <div className="weather-index">
              <label>Timezone:</label>
              {this.state.timezone}
            </div>

            <table className="weather-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Temperature Max (°C)</th>
                  <th>Temperature Min (°C)</th>
                  <th>Precipitation (mm)</th>
                </tr>
              </thead>
              <tbody>
                {this.renderWeatherTableRows()}
              </tbody>
            </table>

            <div className="app-section">
              <h2>Errors</h2>
            </div>

            {this.state.weatherData && this.state.weatherData.errorsHash && Object.keys(this.state.weatherData.errorsHash).length > 0 ? (
              <div>
                {Object.entries(this.state.weatherData.errorsHash).map(([key, error]) => (
                  <div key={key} className="flagError" style={{ marginBottom: "10px", padding: "10px", backgroundColor: "#ffe6e6", borderLeft: "4px solid #ff0000" }}>
                    <strong>{key}:</strong> {error}
                  </div>
                ))}
              </div>
            ) : (
              <p>No errors found.</p>
            )}

            <p></p>
          </div>
        )}
      </div>
    );
  }

  fetchWeatherData = async () => {
    const latitude = this.state.latitude;
    const longitude = this.state.longitude;
    
    this.setState({ isLoading: true, error: null });
    
    try {
      const data = await this.weatherService.fetchWeatherData(latitude, longitude);
      console.log("Fetched weather data:", data);
      console.log("Data structure - Keys:", Object.keys(data));
      console.log("Daily data:", data.daily);

      // Extract latitude, longitude, and timezone from the first weather item in weatherDataList
      let fetchedLatitude = latitude;
      let fetchedLongitude = longitude;
      let fetchedTimezone = null;

      if (data.weatherDataList && data.weatherDataList.length > 0) {
        const firstWeather = data.weatherDataList[0];
        fetchedLatitude = firstWeather.latitude || latitude;
        fetchedLongitude = firstWeather.longitude || longitude;
        fetchedTimezone = firstWeather.timezone || null;
      }

      this.setState({
        weatherData: data,
        latitude: fetchedLatitude,
        longitude: fetchedLongitude,
        timezone: fetchedTimezone,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        error: error.message,
        isLoading: false,
      });
    }
  }
}

export default WeatherDisplay;
