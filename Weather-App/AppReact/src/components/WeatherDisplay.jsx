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
      fetchedLatitude: null,
      fetchedLongitude: null,
      timezone: null,
      weatherData: null,
      isLoading: false,
      error: null,
      dateSortDirection: "asc",
    };
  }

  handleLatitudeChange = (latitude) => {
    this.setState({ latitude: parseFloat(latitude) });
  };

  handleLongitudeChange = (longitude) => {
    this.setState({ longitude: parseFloat(longitude) });
  };

  toggleDateSort = () => {
    this.setState((prevState) => ({
      dateSortDirection: prevState.dateSortDirection === "asc" ? "desc" : "asc",
    }));
  };

  renderWeatherTableRows = () => {
    const { weatherData, dateSortDirection } = this.state;
    
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
            allRows.push({
              date,
              tempMax: tempMax[index] || 0,
              tempMin: tempMin[index] || 0,
              precip: precip && precip[index] ? precip[index] : 0,
              latitude: weather.latitude,
              index,
            });
          });
        }
      });

      // Sort by date
      allRows.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateSortDirection === "asc" ? dateA - dateB : dateB - dateA;
      });

      return allRows.length > 0 ? allRows.map((row) => (
        <tr key={`${row.latitude}-${row.date}-${row.index}`}>
          <td>{row.date}</td>
          <td>{row.tempMax}</td>
          <td>{row.tempMin}</td>
          <td>{row.precip}</td>
        </tr>
      )) : (
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

      // Create array of data objects for sorting
      const dataArray = times.map((date, index) => ({
        date,
        tempMax: tempMax[index] || "N/A",
        tempMin: tempMin[index] || "N/A",
        precip: precip && precip[index] ? precip[index] : "N/A",
        index,
      }));

      // Sort by date
      dataArray.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateSortDirection === "asc" ? dateA - dateB : dateB - dateA;
      });

      return dataArray.map((row) => (
        <tr key={row.index}>
          <td>{row.date}</td>
          <td>{row.tempMax}</td>
          <td>{row.tempMin}</td>
          <td>{row.precip}</td>
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
              {this.state.fetchedLatitude}
            </div>

            <div className="weather-index">
              <label>Longitude:</label>
              {this.state.fetchedLongitude}
            </div>

            <div className="weather-index">
              <label>Timezone:</label>
              {this.state.timezone}
            </div>

            <table className="weather-table">
              <thead>
                <tr>
                  <th onClick={this.toggleDateSort} style={{ cursor: "pointer" }}>
                    Date
                    <span style={{ marginLeft: "8px" }}>
                      {this.state.dateSortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  </th>
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
                  <div key={key} className="flagError">
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

      // Extract timezone, latitude, and longitude from the first weather item in weatherDataList
      let fetchedTimezone = null;
      let fetchedLatitude = null;
      let fetchedLongitude = null;

      if (data.weatherDataList && data.weatherDataList.length > 0) {
        const firstWeather = data.weatherDataList[0];
        fetchedTimezone = firstWeather.timezone || null;
        fetchedLatitude = firstWeather.latitude || null;
        fetchedLongitude = firstWeather.longitude || null;
      }

      this.setState({
        weatherData: data,
        timezone: fetchedTimezone,
        fetchedLatitude: fetchedLatitude,
        fetchedLongitude: fetchedLongitude,
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
